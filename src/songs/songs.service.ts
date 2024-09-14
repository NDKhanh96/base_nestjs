import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    paginate,
    type IPaginationOptions,
    type Pagination,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';
import type { CreateSongDto } from 'src/songs/dto/create-song-dto';
import type { UpdateSongDTO } from 'src/songs/dto/update-song-dto';
import { Song } from 'src/songs/song.entity';
import {
    In,
    type Repository,
    type SelectQueryBuilder,
    type UpdateResult,
} from 'typeorm';

@Injectable()
export class SongsService {
    constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    ) {}

    async create(createSongDTO: CreateSongDto): Promise<Song> {
        const song = new Song();

        song.title = createSongDTO.title;
        song.artists = createSongDTO.artists;
        song.duration = createSongDTO.duration;
        song.lyrics = createSongDTO.lyrics;
        song.releasedDate = createSongDTO.releasedDate;

        song.artists = await this.artistsRepository.findBy({
            id: In(createSongDTO.artists),
        });

        await this.songsRepository.save(song);

        return song;
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
        recordToUpdate: UpdateSongDTO,
    ): Promise<UpdateResult> {
        return await this.songsRepository.update(id, recordToUpdate);
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
        const queryBuilder: SelectQueryBuilder<Song> =
      this.songsRepository.createQueryBuilder('songs');

        queryBuilder.orderBy('songs.releasedDate', 'DESC');

        return paginate<Song>(queryBuilder, options);
    }
}
