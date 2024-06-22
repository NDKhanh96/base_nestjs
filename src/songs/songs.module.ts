import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from 'src/songs/song.entity';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { Artist } from 'src/artists/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
