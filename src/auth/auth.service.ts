import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from 'src/types/payload.type';
import { Enable2FAType } from 'src/types/auth-types';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { v4 as uuid4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService, // 1
    private artistService: ArtistsService,
    private configService: ConfigService,
  ) {}

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    const user = await this.userService.findOne(loginDTO); // 1.
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    ); // 2.
    if (passwordMatched) {
      // 3.
      delete user.password; // 4.
      // return user;
      // Sends JWT Token back in the response
      // const payload = { email: user.email, sub: user.id };
      const payload: PayloadType = { email: user.email, userId: user.id };
      const artist = await this.artistService.findArtist(user.id); // 1
      if (artist) {
        payload.artistId = artist.id;
      }
      // If user has enabled 2FA and have the secret key then
      if (user.enable2FA && user.twoFASecret) {
        //1.
        // sends the validateToken request link
        // else otherwise sends the json web token in the response
        return {
          //2.
          validate2FA: 'http://localhost:3000/auth/validate-2fa',
          message:
            'Please send the one-time password/token from your Google Authenticator App',
        };
      }

      // find if it is an artist then the add the artist id to payload
      // const artist = await this.artistService.findArtist(user.id); // 2
      // if (artist) {
      //   // 3
      //   payload.artistId = artist.id;
      // }
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Password does not match'); // 5.
    }
  }

  // async signup(userDTO: CreateUserDTO): Promise<User> {
  //   const user = new User();
  //   user.firstName = userDTO.firstName;
  //   user.lastName = userDTO.lastName;
  //   user.email = userDTO.email;
  //   user.apiKey = uuid4();
  //   user.password = userDTO.password;
  //   const savedUser = await this.userRepository.save(user);
  //   delete savedUser.password;
  //   return savedUser;
  // }

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId); //1
    if (user.enable2FA) {
      //2
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret(); //3
    console.log(secret);
    user.twoFASecret = secret.base32; //4
    await this.userService.updateSecretKey(user.id, user.twoFASecret); //5
    return { secret: user.twoFASecret }; //6
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      // find the user on the based on id
      const user = await this.userService.findById(userId);
      // extract his 2FA secret
      // verify the secret with a token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });
      // if validated then sends the json web token in the response
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.findByApiKey(apiKey);
  }

  getEnvVariables() {
    return {
      port: this.configService.get<number>('port'),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
