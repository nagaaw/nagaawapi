import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../core/entities/user.entity';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { LinkedInStrategy } from './utils/linkedin.strategy';
import { Company } from '../core/entities/company.entity';
import { SocialmediaController } from './controllers/socialmedia/socialmedia.controller';
import { LinkedinService } from './services/linkedin/linkedin.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User,Company]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultSecretKey',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController, SocialmediaController],
  providers: [AuthService, LinkedInStrategy, LinkedinService],
  exports: [AuthService],
})
export class AuthModule {}
