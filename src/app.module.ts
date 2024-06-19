import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from 'src/songs/song.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DevConfigService } from './common/providers/DevConfigService';
import { SongsModule } from './songs/songs.module';

const devConfig = { port: 3000 };
const proConfig = { port: 4000 };

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'demo_nestjs',
      entities: [Song],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SongsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DevConfigService,
    {
      provide: 'CONFIG',
      useFactory: () =>
        process.env.NODE_ENV === 'development' ? devConfig : proConfig,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'songs', method: RequestMethod.POST });
  }
}
