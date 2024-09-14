import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { CreatePlaylistDto } from 'src/playlists/dto/create-playlist.dto';
import { Playlist } from 'src/playlists/playlist.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PlaylistsService {
    constructor(
    @InjectRepository(Playlist)
    private playlistRepo: Repository<Playlist>,

    @InjectRepository(Song)
    private songsRepo: Repository<Song>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
    ) {}

    async create(playListDTO: CreatePlaylistDto): Promise<Playlist> {
        const playList = new Playlist();
        const user = await this.userRepo.findOneBy({ id: playListDTO.user });
        const songs = await this.songsRepo.findBy({
            id: In(playListDTO.songs),
        });

        playList.name = playListDTO.name;
        playList.user = user;
        playList.songs = songs;

        return this.playlistRepo.save(playList);
    }
}
