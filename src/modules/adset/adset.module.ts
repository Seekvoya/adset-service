import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeNodeEntity } from './entities/adset.entity';
import { AdSetService } from './adset.service';
import { AdSetController } from './adset.controller';
import { NodeProbabilityEntity } from './entities/node-probabilities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TreeNodeEntity,
      NodeProbabilityEntity
    ])
  ],
  controllers: [AdSetController],
  providers: [AdSetService],
  exports: [AdSetService]
})
export class AdsetModule {}
