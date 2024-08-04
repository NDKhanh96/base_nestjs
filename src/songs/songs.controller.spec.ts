/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import type { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Playlist } from 'src/playlists/playlist.entity';
import type { CreateSongDto } from 'src/songs/dto/create-song-dto';
import type { UpdateSongDTO } from 'src/songs/dto/update-song-dto';
import type { Song } from 'src/songs/song.entity';
import { SongsService } from 'src/songs/songs.service';
import type { UpdateResult } from 'typeorm';
import { SongsController } from './songs.controller';

describe('SongsController', (): void => {
  let controller: SongsController;

  const oneSong: Song = {
    id: 1,
    title: '1',
    artists: [],
    releasedDate: undefined,
    duration: undefined,
    lyrics: 'La la la',
    playlist: new Playlist(),
  };

  const songArray: Song[] = [oneSong];

  const paginateData = {
    items: songArray,
    meta: {
      itemCount: songArray.length,
      totalItems: songArray.length,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };

  beforeEach(async (): Promise<void> => {
    /**
     * NestJS tự động tạo ra một fake module.
     * Khi thực hiện compile, nó khởi tạo tất cả các phụ thuộc cần thiết cho module thử nghiệm.
     * Đảm bảo một môi trường thử nghiệm độc lập với môi trường thực tế,
     * nơi các thí nghiệm có thể được tiến hành riêng biệt.
     */
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      /**
       * Thay vì dùng SongsService thật, ta sử dụng mock service.
       */
      providers: [
        {
          /**
           * Tên của service cần mock phải trùng với tên của service thật.
           */
          provide: SongsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(songArray),
            findOne: jest
              .fn()
              .mockImplementation((id: number): Promise<Song> => {
                return Promise.resolve(oneSong);
              }),
            create: jest
              .fn()
              .mockImplementation(
                (createSongDto: CreateSongDto): Promise<Song> => {
                  return Promise.resolve(oneSong);
                },
              ),
            /**
             * Có thể lựa chọn giữa mockResolvedValue và mockImplementation.
             * MockImplementation giả lập 1 hàm tuy nhiên hàm này chỉ làm duy nhất việc return về giá trị nên dùng mockResolvedValue cũng được.
             */
            remove: jest.fn().mockResolvedValue(Promise.resolve()),
            update: jest
              .fn()
              .mockImplementation(
                (
                  id: number,
                  recordToUpdate: UpdateSongDTO,
                ): Promise<{ affected: 1 }> => {
                  return Promise.resolve({ affected: 1 });
                },
              ),
            paginate: jest
              .fn()
              .mockImplementation((): Promise<Pagination<Song>> => {
                return Promise.resolve(paginateData);
              }),
          },
        },
      ],
    }).compile();

    /**
     * Việc lấy 1 instance của controller dependency là 1 quá trình đơn giản.
     * Nó bao gồm dùng method module.get(), đóng vai trò là đường dẫn trực tiếp đến các dependency mong muốn,
     * giống như việc lấy 1 cuốn sach cụ thể từ kệ được sắo xếp hợp lý bằng cách sử dụng catalog.
     * Lưu ý rằng nếu không phải @Controller({ path: 'songs', scope: Scope.DEFAULT }) mà là Scope.TRANSIENT hay REQUEST thì không dùng dc module.get().
     */
    controller = module.get<SongsController>(SongsController);
  });

  it('should be defined', (): void => {
    expect(controller).toBeDefined();
  });

  it('should return paginate songs', async (): Promise<void> => {
    const songs: Pagination<Song, IPaginationMeta> = await controller.findAll();
    expect(songs).toEqual(paginateData);
  });

  it('should return one song', async (): Promise<void> => {
    const song: Song = await controller.findOne(1);
    expect(song).toEqual(oneSong);
  });

  it('should create a song', async (): Promise<void> => {
    const song: Song = await controller.create(oneSong);
    expect(song).toEqual(oneSong);
  });

  it('should delete a song', async (): Promise<void> => {
    const song: void = await controller.delete(1);
    expect(song).toBeUndefined();
  });

  it('should update a song', async (): Promise<void> => {
    const song: UpdateResult = await controller.update(1, oneSong);
    expect(song).toEqual({ affected: 1 });
  });
});
