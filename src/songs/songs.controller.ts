import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Scope,
  Delete,
  Put,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import type { Song } from 'src/songs/song.entity';
import { CreateSongDto } from './dto/create-song-dto';
import { SongsService } from './songs.service';
import type { UpdateResult } from 'typeorm';
import type { Pagination } from 'nestjs-typeorm-paginate';

@Controller({ path: 'songs', scope: Scope.REQUEST })
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post()
  create(@Body() createSongDto: CreateSongDto): Promise<Song> {
    return this.songsService.create(createSongDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.songsService.remove(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: CreateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDto);
  }
}
