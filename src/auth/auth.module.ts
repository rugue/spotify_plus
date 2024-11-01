import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from './auth.constants';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: authConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  exports: [AuthService],
})
export class AuthModule {}
