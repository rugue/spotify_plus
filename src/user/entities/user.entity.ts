import { Playlist } from 'src/playlists/entities/playlist.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column()
  apiKey: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  phone: string;

  /**
   * A user can create many playLists
   */
  @OneToMany(() => Playlist, (playList) => playList.user)
  playLists: Playlist[];
}
