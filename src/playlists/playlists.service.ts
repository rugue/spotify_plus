import { Injectable } from '@nestjs/common';
import { CreatePlayListDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { Song } from 'src/songs/entities/song.entity';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(Song) private songRepository: Repository<Song>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(playListDTO: CreatePlayListDto): Promise<Playlist> {
    const playlist = new Playlist();
    playlist.name = playListDTO.name;

    // songs will be the array of IDs that we are getting from the DTO object
    const songs = await this.songRepository.findBy({
      id: In(playListDTO.songs),
    });
    //Set the relation for the songs with the playlist entity
    playlist.songs = songs;
    // A user will be the ID of the user we are getting from the request
    //When we implemented the user authentication this id will become the logged in user id
    const user = await this.userRepository.findOne({
      where: { id: playListDTO.user },
    });
    return this.playlistRepository.save(playlist);
  }

  findAll() {
    return `This action returns all playlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
