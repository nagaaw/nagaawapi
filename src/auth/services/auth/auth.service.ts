import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException, ForbiddenException, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../../../core/entities/user.entity';
import { Company } from '../../../core/entities/company.entity';
import { UserAccessInfo } from '../../../core/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company) 
    private companyRepository: Repository<Company>,

  ) {}

  private async generateTokens(user: User) {
    const accessToken = this.jwtService.sign({ id: user.id, email: user.email }, { expiresIn: '15m' }); // Access Token de 15 min
    const refreshToken = this.jwtService.sign({ id: user.id }, { expiresIn: '7d' }); // Refresh Token de 7 jours

    // Stocker le refresh token en base
    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours d'expiration
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }


  /**
   * Create a new user account and store details in MySQL using TypeORM.
   */
  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    manager?: EntityManager
  ): Promise<UserAccessInfo> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
      });
      if(manager){
        
        const createdUser =  await manager.save(User, user);
        const jwtToken = this.jwtService.sign({ id: user.id, email });

        const userAccesInfo: UserAccessInfo = new UserAccessInfo()

      userAccesInfo.accessToken = jwtToken;
      userAccesInfo.message = 'User created successfully';
      userAccesInfo.user = {
        email: createdUser.email,
        id: createdUser.id
      }
      }
     const createdUser =  await this.userRepository.save(user);

     if(!createdUser){
     throw new  NotAcceptableException("Can not created user")
     }

      // Generate JWT Token
      const jwtToken = this.jwtService.sign({ id: user.id, email });

      const userAccesInfo: UserAccessInfo = new UserAccessInfo()

      userAccesInfo.accessToken = jwtToken;
      userAccesInfo.message = 'User created successfully';
      userAccesInfo.user = {
        email: createdUser.email,
        id: createdUser.id
      }
      return userAccesInfo;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  /**
   * Log in with email and password, validating against MySQL.
   */
  async loginWithEmailPassword(email: string, password: string) {

    try {
      const user = await this.userRepository.findOne({ where: { email } });
      console.log("LINE => 63",user)
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("LINE => 68",isPasswordValid)
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT Token
      const jwtToken = this.jwtService.sign({ id: user.id, email: user.email });
      console.log("LINE => 75",jwtToken)

      return { accessToken: jwtToken };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
/**
   * Request password reset - Generates a reset token
   */
  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await this.userRepository.save(user);

    return {
      message: 'Reset password token generated',
      resetToken, // In production, send this via email instead of returning it
    };
  }

  /**
   * Reset password using token
   */
  async resetPassword(resetToken: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { resetToken } });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetToken = null;
    user.resetTokenExpiry = null;

    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({ where: { id: decoded.id, refreshToken } });

      if (!user || user.refreshTokenExpiry! < new Date()) {
        throw new ForbiddenException('Invalid or expired refresh token');
      }

      return await this.generateTokens(user);
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null, refreshTokenExpiry: null });
    return { message: 'Logout successful' };
  }

  async validateOAuthLogin(profile: any) {
    let user = await this.userRepository.findOne({
      where: { linkedinId: profile.id },
      relations: ['company'],
    });

  }
}
