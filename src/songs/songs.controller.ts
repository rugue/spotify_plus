import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './entities/song.entity';
import { UpdateSongDto } from './dto/update-song.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/auth/jwt-artist.guard';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}
  @Post()
  @UseGuards(JwtArtistGuard) // 1
  create(@Body() createSongDTO: CreateSongDto, @Request() req): Promise<Song> {
    console.log('req.user:', req.user);
    return this.songsService.create(createSongDTO);
  }
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({
      page,
      limit,
    });
  }
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDTO);
  }
  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number): Promise<DeleteResult> {
    return this.songsService.remove(id);
  }
}
