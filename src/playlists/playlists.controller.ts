import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist } from './playlist.entity';
import { PlaylistsService } from './playlists.service';

@Controller('playlists')
export class PlayListsController {
  constructor(private playListService: PlaylistsService) {}
  @Post()
  create(
    @Body()
    playlistDTO: CreatePlaylistDto,
  ): Promise<Playlist> {
    return this.playListService.create(playlistDTO);
  }
}
