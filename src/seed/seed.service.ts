import { Injectable } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { DataSource } from 'typeorm';
import { seedData } from 'db/seeds/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly connection: DataSource) {}

  async seed(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner(); //1
    await queryRunner.connect(); //2
    await queryRunner.startTransaction(); //3
    try {
      const manager = queryRunner.manager;
      await seedData(manager);
      await queryRunner.commitTransaction(); //4
    } catch (err) {
      console.log('Error during database seeding:', err);
      await queryRunner.rollbackTransaction(); // 5
    } finally {
      await queryRunner.release(); //6
    }
  }

  create(createSeedDto: CreateSeedDto) {
    return 'This action adds a new seed';
  }

  findAll() {
    return `This action returns all seed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seed`;
  }

  update(id: number, updateSeedDto: UpdateSeedDto) {
    return `This action updates a #${id} seed`;
  }

  remove(id: number) {
    return `This action removes a #${id} seed`;
  }
}
