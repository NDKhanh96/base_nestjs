/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
    paginate,
    type IPaginationMeta,
    type IPaginationOptions,
    type Pagination,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';
import type { CreateSongDto } from 'src/songs/dto/create-song-dto';
import type { UpdateSongDTO } from 'src/songs/dto/update-song-dto';
import { Song } from 'src/songs/song.entity';
import { SongsService } from 'src/songs/songs.service';
import {
    Repository,
    type DeleteResult,
    type FindOneOptions,
    type UpdateResult,
} from 'typeorm';

/**
 * Thay thế tất cả các hàm trong module nestjs-typeorm-paginate bằng mock function.
 * Nhờ đó có thể định nghĩa hành vi của hàm trong module bằng các phương thức mockResolvedValue, mockReturnValue, mockImplementation
 */
jest.mock('nestjs-typeorm-paginate');

describe('SongsService', (): void => {
    let service: SongsService;
    let repoSong: Repository<Song>;
    let repoArtist: Repository<Artist>;

    const recordToUpdate: UpdateSongDTO = {
        title: '2',
        artists: [],
        releasedDate: undefined,
        duration: undefined,
        lyrics: 'Ha ha ha',
    };

    const oneSong: CreateSongDto = {
        title: '1',
        artists: [],
        releasedDate: undefined,
        duration: undefined,
        lyrics: 'La la la',
    };

    const songArray: CreateSongDto[] = [oneSong];

    beforeEach(async (): Promise<void> => {
        const module: TestingModule = await Test.createTestingModule({
            /**
       * Inject các dependency cần thiết cho service để khởi tạo testing module.
       * Cách nhận biết các dependency cần thiết là dựa vào constructor của service.
       * Như ví dụ này, SongsService cần 2 dependency: Song và Artist.
       */
            providers: [
                /**
         * Vì đang viết test cho SongsService nên hiển nhiên cần inject SongsService.
         */
                SongsService,
                /**
         * Mock object cho songsRepository trong songs.service.ts.
         */
                {
                    /**
           * Tên của repository cần mock phải trùng với tên của repository thật.
           */
                    provide: getRepositoryToken(Song),
                    useValue: {
                        find: jest.fn().mockImplementation((): Promise<CreateSongDto[]> => {
                            return Promise.resolve(songArray);
                        }),
                        findOne: jest
                            .fn()
                            .mockImplementation(
                                (options: FindOneOptions<Song>): Promise<CreateSongDto> => {
                                    return Promise.resolve(oneSong);
                                },
                            ),
                        create: jest
                            .fn()
                            .mockImplementation(
                                (createSongDto: CreateSongDto): Promise<CreateSongDto> => {
                                    return Promise.resolve(oneSong);
                                },
                            ),
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
                        delete: jest.fn(),
                        /**
             * Mặc dù trong file test này không có dùng đến hàm save nhưng trong file songs.service.ts thì có nên vẫn cần khai báo nó.
             * Tuy nhiên trong ví dụ này ta không cần giá trị trả về từ save nên không cần mockImplementation.
             */
                        save: jest.fn(),
                        createQueryBuilder: jest.fn().mockReturnValue({
                            orderBy: jest.fn().mockReturnThis(),
                        }),
                    },
                },
                /**
         * Ở đây ta cần mock object cho Artist vì nó là 1 dependency của SongsService.
         * Nếu trong test case này ta không sử dụng đến Artist thì sẽ không cần mock function nào cả (useValue để là object rỗng).
         */
                {
                    provide: getRepositoryToken(Artist),
                    useValue: {
                        findBy: jest.fn().mockImplementation((): Promise<Artist[]> => {
                            return Promise.resolve([]);
                        }),
                    },
                },
            ],
        }).compile();

        /**
     * Tạo biến service và repo để sử dụng trong các test case.
     * service ở đây đại diện cho SongsService mà đã được inject trong providers bên trên.
     */
        service = module.get<SongsService>(SongsService);
        /**
     * repo ở đây đại diện cho Repository<Song> mà đã được inject trong providers bên trên.
     * Nó là 1 mock object, dùng để giả tạo cho songsRepository trong songs.service thật (vào songs.service.ts để xem).
     * Tuy nhiên vì là hàm mock nên ta cần tao ra các mock function cho nó (chính là những thứ ở trong useValue).
     * Trong các service thực tế, sử dụng @InjectRepository để inject repository từ TypeORM vào service,
     * tuy nhiên trong file test thì cần dùng getRepositoryToken để lấy ra token của repository đó và tạo ra các mock repository.
     * Điều này là do trong môi trường test, bạn không muốn kết nối đến cơ sở dữ liệu thực mà thay vào đó,
     * bạn muốn sử dụng các mock object để kiểm tra logic của service một cách độc lập.
     */
        repoSong = module.get<Repository<Song>>(getRepositoryToken(Song));
        repoArtist = module.get<Repository<Artist>>(getRepositoryToken(Artist));
    });

    it('should be defined', (): void => {
        expect(service).toBeDefined();
    });

    it('should give me all songs', async (): Promise<void> => {
        const songs: Song[] = await service.findAll();
        const repoSongSpy: jest.SpyInstance<Promise<Song[]>> = jest.spyOn(
            repoSong,
            'find',
        );

        expect(songs).toEqual(songArray);
        expect(repoSongSpy).toHaveBeenCalledTimes(1);
    });

    it('should give me the song by id', async (): Promise<void> => {
        const song: Song = await service.findOne(Number('1'));
        const repoSongSpy: jest.SpyInstance<Promise<Song>> = jest.spyOn(
            repoSong,
            'findOne',
        );

        expect(song).toEqual(oneSong);
        expect(repoSongSpy).toHaveBeenCalledWith({ where: { id: Number('1') } });
    });

    it('should create a song', async (): Promise<void> => {
        const song: Song = await service.create(oneSong);

        expect(song).toEqual(oneSong);
        expect(repoSong.save).toHaveBeenCalledTimes(1);
        expect(repoArtist.findBy).toHaveBeenCalledTimes(1);
    });

    it('should update a song', async (): Promise<void> => {
        const result: UpdateResult = await service.update(1, recordToUpdate);

        expect(repoSong.update).toHaveBeenCalledTimes(1);
        expect(result.affected).toEqual(1);
    });

    it('should delete a song', async (): Promise<void> => {
        await service.remove(1);
        const repoSpyOn: jest.SpyInstance<Promise<DeleteResult>> = jest.spyOn(
            repoSong,
            'delete',
        );

        expect(repoSong.delete).toHaveBeenCalledTimes(1);
        expect(repoSpyOn).toHaveBeenCalledWith(1);
    });

    it('should paginate songs', async (): Promise<void> => {
        const options: IPaginationOptions = { limit: 10, page: 1 };
        const expectedPagination: Pagination<Song> = {
            items: [],
            meta: {
                itemCount: 0,
                totalItems: 0,
                itemsPerPage: 10,
                totalPages: 0,
                currentPage: 1,
            },
        };

        /**
     * Như đã nói ở dòng jest.mock('nestjs-typeorm-paginate'),
     * ta đã mock hàm paginate trong module nestjs-typeorm-paginate nên có thể dùng mockResolvedValue để giả lập hành vi,
     * cụ thể là giá trị trả về của hàm paginate là bằng expectedPagination.
     */
        (paginate as jest.Mock).mockResolvedValue(expectedPagination);

        const result: Pagination<Song, IPaginationMeta> =
      await service.paginate(options);

        expect(repoSong.createQueryBuilder).toHaveBeenCalledWith('songs');
        expect(result).toEqual(expectedPagination);
    });
});
