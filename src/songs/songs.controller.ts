import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Scope,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './create-song-dto';
import { Connection } from '../common/constants/connection';

@Controller({ path: 'songs', scope: Scope.REQUEST })
export class SongsController {
  constructor(
    private songsService: SongsService,
    @Inject('CONNECTION')
    private connection: Connection,
  ) {
    console.log(`this is connection ${this.connection.CONNECTION_STRING}`);
  }

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
