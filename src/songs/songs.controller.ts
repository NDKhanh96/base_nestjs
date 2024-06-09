import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './create-song-dto';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Get()
  findAll() {
    try {
      return this.songsService.findAll();
    } catch (e) {
      console.log(e);
    }
  }

  @Post()
  create(@Body() createSongDTO: CreateSongDto) {
    return this.songsService.create(createSongDTO);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return 'fetch 1 song by id';
  }

  @Put(':id')
  updateById() {
    return 'update 1 song by id';
  }

  @Delete(':id')
  deleteById() {
    return 'delete song by id';
  }
}
