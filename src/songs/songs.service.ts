import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  type IPaginationOptions,
  type Pagination,
} from 'nestjs-typeorm-paginate';
import type { CreateSongDto } from 'src/songs/dto/create-song-dto';
import type { updateSongDTO } from 'src/songs/dto/update-song-dto';
import { Song } from 'src/songs/song.entity';
import type { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}

  async create(SongDTO: CreateSongDto): Promise<Song> {
    const song = new Song();
    song.title = SongDTO.title;
    song.artists = SongDTO.artists;
    song.duration = SongDTO.duration;
    song.lyrics = SongDTO.lyrics;
    song.releasedDate = SongDTO.releasedDate;

    return await this.songsRepository.save(song);
  }

  async findAll(): Promise<Song[]> {
    return await this.songsRepository.find();
  }

  async findOne(id: number): Promise<Song> {
    return await this.songsRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.songsRepository.delete(id);
  }

  async update(
    id: number,
    recordToUpdate: updateSongDTO,
  ): Promise<UpdateResult> {
    return await this.songsRepository.update(id, recordToUpdate);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songsRepository.createQueryBuilder('songs');
    queryBuilder.orderBy('songs.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }
}
