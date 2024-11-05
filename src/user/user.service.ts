import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // 1.
  ) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    const salt = await bcrypt.genSalt(); // 2.
    userDTO.password = await bcrypt.hash(userDTO.password, salt); // 3.
    // userDTO.apiKey = uuid4();
    // const user = await this.userRepository.save(userDTO); // 4.
    // // const user = new User();
    // delete user.password; // 5.

    // // user.firstName = userDTO.firstName;
    // // user.lastName = userDTO.lastName;
    // // user.email = userDTO.email;
    // // user.apiKey = uuid4();
    // // user.password = userDTO.password;
    // // const savedUser = await this.userRepository.save(user);
    // // delete savedUser.password;
    // return user; // 6.
    const user = new User();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.email = userDTO.email;
    user.apiKey = uuid4(); // Generate the UUID directly on the user entity
    user.password = await bcrypt.hash(userDTO.password, await bcrypt.genSalt());
    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async updateSecretKey(userId, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return this.userRepository.findOneBy({ apiKey });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id: id });
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

  findAll() {
    return `This action returns all user`;
  }

  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
