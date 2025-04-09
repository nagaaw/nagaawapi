import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../../../core/entities/user.entity';
import { UserAccessInfo } from '../../../core/dtos/user.dto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../../../core/services/mailer/mailer.service';
import { OrangeSmsService } from '../../../core/services/sms/orange-sms.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly mailerService: MailerService,
    private readonly orangeSmsService: OrangeSmsService
  ) {}

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign({ id: user.id, email: user.email }, { expiresIn: '24h' });
    const refreshToken = crypto.randomBytes(64).toString('hex');

    user.refreshToken = await this.hashData(refreshToken);
    user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  async createUser(email: string, phone: string, password: string): Promise<UserAccessInfo> {
    return await this.entityManager.transaction(async manager => {
      const existingUser = await manager.findOneBy(User, { email });
      if (existingUser) throw new ConflictException('Email already in use');

      const hashedPassword = await this.hashData(password);
      const otp = crypto.randomInt(100000, 999999).toString();
      const user = manager.create(User, {
        email,
        phone,
        password: hashedPassword,
        otp,
        otpExpiry: new Date(Date.now() + 15 * 60 * 1000),
      });
      const createdUser = await manager.save(user);
      if (!createdUser) throw new Error('Cannot create user');

      await this.mailerService.sendOtpEmail(email, otp);
      // await this.orangeSmsService.sendSms(user.phone, otp);


      const jwtToken = this.jwtService.sign({ id: user.id, email, phone });
      return this.buildUserAccessInfo(jwtToken, createdUser);
    });
  }

  async resendOtp(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await this.userRepository.save(user);

    await this.mailerService.sendOtpEmail(email, otp);
    // await this.orangeSmsService.sendSms(user.phone, otp);
  }

  async validateOtp(email: string, otp: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user || user.otp !== otp || user.otpExpiry! < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.otp = null;
    user.otpExpiry = null;
    user.active = true;
    await this.userRepository.save(user);
  }

  async loginWithEmailPassword(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return await this.generateTokens(user);
  }

  async refreshAccessToken(refreshToken: string) {
    const user = await this.userRepository.findOneBy({ refreshToken: await this.hashData(refreshToken) });
    if (!user || user.refreshTokenExpiry! < new Date()) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
    return await this.generateTokens(user);
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null, refreshTokenExpiry: null });
    return { message: 'Logout successful' };
  }

  private async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  private buildUserAccessInfo(jwtToken: string, user: User): UserAccessInfo {
    return {
      accessToken: jwtToken,
      message: 'User created successfully',
      user: {
        email: user.email,
        phone: user.phone,
        id: user.id,
      },
    };
  }

  async requestResetPassword(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = await this.hashData(resetToken);
    user.resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);
    await this.userRepository.save(user);

    // TODO: Send resetToken to user's email

    return { message: 'Password reset token generated. Check your email.' };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { resetToken: await this.hashData(resetToken) } });
    if (!user || user.resetTokenExpiry! < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await this.hashData(newPassword);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await this.userRepository.save(user);

    return { message: 'Password has been reset successfully' };
  }

  validateOAuthLogin(profile: any) {
    // Implementation for OAuth login validation
    return new User();
  }
}
