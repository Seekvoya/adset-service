import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { AdSetService } from './adset.service';
import { QueryParamsDto } from './dto/adset.dto';
import { NodeProbabilityDto } from './dto/node-probability.dto';

@Controller('adset')
export class AdSetController {
  constructor(private readonly adSetService: AdSetService) {}
  @Get()
  async getAdSet(@Query() params: QueryParamsDto) {
    console.log('Adset route hit');
    return this.adSetService.getAdSet(params);
  }

  @Post('probability')
  async updateProbability(@Body() nodeProbability: NodeProbabilityDto) {
    return this.adSetService.updateProbability(
      nodeProbability.nodeId,
      nodeProbability.newProbability,
    );
  }
}
