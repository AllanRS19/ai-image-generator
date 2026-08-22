import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { type Response } from 'express';
import { type RequestWithUser } from './types/request-with-user.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {
    // Passport redirects to GitHub; this handler body never runs.
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  githubCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const token = this.authService.issueToken(req.user);
    const frontendUrl = this.configService.get<string>('CORS_ORIGIN');

    // Redirect back to the frontend with the token as a query param;
    // the frontend picks it up and stores it (e.g. in memory or localStorage).
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
}
