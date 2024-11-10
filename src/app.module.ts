import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerModule } from './common/middleware/logger/logger.module';
import { SongsController } from './songs/songs.controller';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './auth/jwt.strategy';
import { dataSourceOptions } from '../db/data-source';
import { SeedModule } from './seed/seed.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.development.env', '.production.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRoot(
      dataSourceOptions,
      //   {
      //   type: process.env.DB_TYPE as 'postgres',
      //   host: process.env.DB_HOST,
      //   port: parseInt(process.env.DB_PORT, 10),
      //   username: process.env.DB_USERNAME,
      //   password: process.env.DB_PASSWORD,
      //   database: process.env.DB_DATABASE,
      //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //   synchronize: true,
      // }
    ),
    SongsModule,
    LoggerModule,
    UserModule,
    PlaylistsModule,
    AuthModule,
    ArtistsModule,
    SeedModule,
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET || 'default_secret', // Use an environment variable
    //   signOptions: { expiresIn: '60m' },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService, JWTStrategy],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log('Data source:', dataSource.driver.database);
    console.log('Database connected:', this.dataSource.isInitialized);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
