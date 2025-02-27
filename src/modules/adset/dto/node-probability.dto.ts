import { IsNumber } from "class-validator";

export class NodeProbabilityDto {
  @IsNumber()
  nodeId: number;

  @IsNumber()
  newProbability: number;
}
