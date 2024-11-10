import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { Auth } from './auth/entities/auth.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(
    @Request()
    req,
  ) {
    return req.user;
  }
  // @Get('profile')
  // @UseGuards(JwtAuthGuard)
  // getProfile(
  //   @Req()
  //   req,
  // ) {
  //   return req.user;
  // }
}
