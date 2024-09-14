import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/artists/artist.entity';
import { ArtistsModule } from 'src/artists/artists.module';
import { Playlist } from 'src/playlists/playlist.entity';
import { PlaylistsModule } from 'src/playlists/playlists.module';
import type { CreateSongDto } from 'src/songs/dto/create-song-dto';
import type { UpdateSongDTO } from 'src/songs/dto/update-song-dto';
import { Song } from 'src/songs/song.entity';
import { SongsModule } from 'src/songs/songs.module';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';
import { type Repository } from 'typeorm';

const date = '2023-05-11T00:00:00.000Z';
const duration = '02:34:00';

describe('Song - /songs', (): void => {
  let app: INestApplication;

  /**
   * TypeORMError: Entity metadata for Song#playlist was not found.
   * Check if you specified a correct entity object and if it's connected in the connection options.
   * Nếu bị lỗi trên thì cần thêm Playlist vào mảng entities của TypeOrmModule.forRoot, tương tự với Artist và User
   */
  beforeAll(async (): Promise<void> => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '123456',
          database: 'base_nestjs_test',
          synchronize: true,
          entities: [Song, Artist, Playlist, User],
          dropSchema: true,
        }),
        SongsModule,
        ArtistsModule,
        PlaylistsModule,
        UsersModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async (): Promise<void> => {
    /**
     * app.get() sẽ nhận 1 string làm tham số, và trả về 1 instance của class hoặc provider có tên tương ứng
     * tuy nhiên, hiện chưa rõ làm sao để biết được đâu là string đúng để truyền vào
     * vậy nên ta dùng getRepositoryToken() để lấy ra string đó
     */
    const songRepository: Repository<Song> = app.get(getRepositoryToken(Song));
    await songRepository.delete({});
  });

  const createSong = (createSongDTO: CreateSongDto): Promise<Song> => {
    const song = new Song();
    song.title = createSongDTO.title;
    song.artists = createSongDTO.artists;
    song.duration = createSongDTO.duration;
    song.lyrics = createSongDTO.lyrics;
    song.releasedDate = createSongDTO.releasedDate;
    song.artists = [];

    const songRepo: Repository<Song> = app.get('SongRepository');
    return songRepo.save(song);
  };

  it(`/GET songs`, async (): Promise<void> => {
    const newSong: Song = await createSong({
      title: 'Animals',
      artists: [],
      releasedDate: new Date(date),
      duration: duration as unknown as Date,
      lyrics: 'La la la',
    });
    const results: request.Response = await request(app.getHttpServer()).get(
      '/songs',
    );
    expect(results.statusCode).toBe(200);
    expect(results.body.items).toHaveLength(1);
    expect(results.body.items[0].title).toEqual(newSong.title);
    expect(results.body.items[0].duration).toEqual(newSong.duration);
    expect(results.body.items[0].lyrics).toEqual(newSong.lyrics);
    expect(new Date(results.body.items[0].releasedDate)).toEqual(
      newSong.releasedDate,
    );
  });

  it('/GET songs/:id', async (): Promise<void> => {
    const newSong: Song = await createSong({
      title: 'Animals',
      artists: [],
      releasedDate: new Date(date),
      duration: duration as unknown as Date,
      lyrics: 'La la la',
    });
    const results: request.Response = await request(app.getHttpServer()).get(
      `/songs/${newSong.id}`,
    );
    expect(results.statusCode).toBe(200);
    expect(results.body.title).toEqual(newSong.title);
    expect(results.body.duration).toEqual(newSong.duration);
    expect(results.body.lyrics).toEqual(newSong.lyrics);
    expect(new Date(results.body.releasedDate)).toEqual(newSong.releasedDate);
  });

  // do code lỗi nên không test được
  it('/PUT songs/:id', async (): Promise<void> => {
    const newSong: Song = await createSong({
      title: 'Animals',
      artists: [],
      releasedDate: new Date(date),
      duration: duration as unknown as Date,
      lyrics: 'La la la',
    });
    const updateSongDTO: UpdateSongDTO = {
      title: 'Wonderful',
      artists: [],
      releasedDate: new Date(date),
      duration: duration as unknown as Date,
      lyrics: 'Ha ha ha',
    };
    const results: request.Response = await request(app.getHttpServer())
      .put(`/songs/${newSong.id}`)
      .send(updateSongDTO);

    expect(results.statusCode).toBe(200);
  });

  // tắt useGuard của controller này đi là dc
  it('/POST songs', async (): Promise<void> => {
    const createSongDTO: CreateSongDto = {
      title: 'Animals',
      artists: [],
      releasedDate: new Date(date),
      duration: duration as unknown as Date,
      lyrics: 'La la la',
    };
    const results: request.Response = await request(app.getHttpServer())
      .post('/songs')
      .send(createSongDTO);
    expect(results.status).toBe(201);
    expect(results.body.title).toEqual(createSongDTO.title);
  });

  it('/DELETE songs/:id', async (): Promise<void> => {
    const newSong: Song = await createSong({
      title: 'Animals',
      artists: [],
      releasedDate: new Date(date),
      duration: duration as unknown as Date,
      lyrics: 'La la la',
    });
    const results: request.Response = await request(app.getHttpServer()).delete(
      `/songs/${newSong.id}`,
    );
    expect(results.statusCode).toBe(200);
  });
});
