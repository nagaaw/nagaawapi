import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('phone') phone: string,
    @Body('password') password: string,
  ) {
    return this.authService.createUser(firstName, lastName, email, phone, password);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.loginWithEmailPassword(email, password);
  }

  @Post('request-reset-password')
  async requestResetPassword(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('resetToken') resetToken: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(resetToken, newPassword);
  }
  // Redirection vers LinkedIn
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLogin() {
    return { message: 'Redirecting to LinkedIn...' };
  }

  // Callback après l'auth LinkedIn
  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthRedirect(@Req() req) {
    return {
      message: 'User successfully authenticated with LinkedIn',
      user: req.user,
    };
  }

  @Post('refresh-token')
  async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logout')
  async logout(@Body('userId') userId: number) {
    return this.authService.logout(userId);
  }
}
