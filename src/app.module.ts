import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AdSetController } from './modules/adset/adset.controller';
import { AdSetService } from './modules/adset/adset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfigService from './config/ormconfig';
import { AdsetModule } from './modules/adset/adset.module';
import EnvConfig from './config/envConfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${EnvConfig.redis.host || 'localhost'}:${EnvConfig.redis.port || 6379}`,
    }),
    AdsetModule,
  ],
})
export class AppModule {}
