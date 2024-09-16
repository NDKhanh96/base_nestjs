import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { dbConfig, globalConfig } from 'src/utils/common/constants';
import { getEnvFilePathSync } from 'src/utils/common/environment/checkGitBranch';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './utils/common/middleware/logger.middleware';

/**
 * TypeORMError: Entity metadata for Song#playlist was not found.
 * Check if you specified a correct entity object and if it's connected in the connection options.
 * Nếu bị lỗi trên thì cần thêm Playlist vào mảng entities của TypeOrmModule.forRoot, tương tự với Artist và User
 */
@Module({
    imports: [
    // env config module must be imported first
        ConfigModule.forRoot({
            envFilePath: getEnvFilePathSync(),
            isGlobal: true,
            /**
             * Những file cấu hình trong mảng load có thể được dùng như biến env.
             * Ví dụ: dbConfig() sẽ trả về một object chứa thông tin cấu hình db
             * và có thể sử dụng như một biến env thông qua ConfigModule.
             * Ví dụ: ConfigService.get<number>('port') sẽ trả về giá trị của dbConfig().port dưới dạng number.
             * Chỉ nên xử dụng những biến môi trường trong thư mục src/utils/common/constants để dễ quản lý thay vì dùng trực tiếp trong file .env
             */
            load: [dbConfig, globalConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('host'),
                port: configService.get<number>('dbPort'),
                username: configService.get<string>('dbUsername'),
                password: configService.get<string>('dbPassword'),
                database: configService.get<string>('database'),
                synchronize: configService.get<boolean>('isDevelopENV'),
                entities: [User],
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
