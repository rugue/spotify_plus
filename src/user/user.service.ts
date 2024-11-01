import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // 1.
  ) {}
  async create(userDTO: CreateUserDTO): Promise<User> {
    const salt = await bcrypt.genSalt(); // 2.
    userDTO.password = await bcrypt.hash(userDTO.password, salt); // 3.
    const user = await this.userRepository.save(userDTO); // 4.
    delete user.password; // 5.
    return user; // 6.
  }

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
