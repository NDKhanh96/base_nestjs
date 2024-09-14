import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from 'src/playlists/playlist.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { PlayListsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';

@Module({
    imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
    controllers: [PlayListsController],
    providers: [PlaylistsService],
})
export class PlaylistsModule {}
