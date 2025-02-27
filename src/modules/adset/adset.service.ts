import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { AdModuleDto, QueryParamsDto } from './dto/adset.dto';
import { TreeNodeEntity } from './entities/adset.entity';
import { NodeProbabilityEntity } from './entities/node-probabilities.entity';

@Injectable()
export class AdSetService {
  constructor(
    @InjectRepository(TreeNodeEntity)
    private readonly treeRepo: Repository<TreeNodeEntity>,
    @InjectRepository(NodeProbabilityEntity)
    private readonly nodeProbabilityRepo: Repository<NodeProbabilityEntity>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getAdSet(
    params: QueryParamsDto,
  ): Promise<{ adset_id: number; modules: AdModuleDto[] }> {
    try {
      const cacheKey = `adset:${params.geo}:${params.device}`;
      const cachedResult = await this.redis.get(cacheKey);

      if (cachedResult) {
        return JSON.parse(cachedResult) as {
          adset_id: number;
          modules: AdModuleDto[];
        };
      }

      const root = await this.treeRepo.findOne({ where: { parent: IsNull() } });
      if (!root) {
        throw new NotFoundException('Root node not found');
      }

      const modules = await this.traverseTree(root, params);
      const result = { adset_id: Date.now(), modules };

      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
      return result;
    } catch (error) {
      console.error('Error in getAdSet:', error);
      throw error;
    }
  }

  async updateProbability(nodeId: number, newProbability: number): Promise<void> {
    try {
      const cacheKey = `probability:${nodeId}`;
      const existingProbability = await this.redis.get(cacheKey);

      if (existingProbability !== newProbability.toString()) {
        await this.redis.set(cacheKey, newProbability.toString(), 'EX', 3600);
      }

      await this.nodeProbabilityRepo.update({ nodeId }, { probability: newProbability });
    } catch (error) {
      console.error(`Error updating probability for node ${nodeId}:`, error);
      throw error;
    }
  }

  private async traverseTree(
    node: TreeNodeEntity,
    params: QueryParamsDto,
    depth: number = 0,
    maxDepth: number = 10,
  ): Promise<AdModuleDto[]> {
    try {
      if (depth >= maxDepth) {
        console.warn('Max depth reached for node:', node.id);
        return [];
      }

      const cacheKey = `treeNode:${node.id}:${params.geo}:${params.device}`;
      let children: TreeNodeEntity[];

      const cachedChildren = await this.redis.get(cacheKey);
      if (cachedChildren) {
        children = JSON.parse(cachedChildren);
      } else {
        children = await this.treeRepo.find({ where: { parent: node.id } });
        await this.redis.set(cacheKey, JSON.stringify(children), 'EX', 3600);
      }

      if (children.length === 0) {
        return [];
      }

      const filteredNodes = children.filter((child) =>
        this.isNodeMatching(child, params),
      );

      if (filteredNodes.length === 0) {
        return [];
      }

      const selectedNode = await this.selectByProbability(filteredNodes);

      if (!selectedNode) {
        return [];
      }

      const modules = await this.traverseTree(selectedNode, params, depth + 1, maxDepth);
      return [{ type: selectedNode.type, name: selectedNode.name }, ...modules];
    } catch (error) {
      console.error('Error in traverseTree for node:', node.id, error);
      throw error;
    }
  }

  private isNodeMatching(node: TreeNodeEntity, params: QueryParamsDto): boolean {
    const conditions = node.conditions as Record<string, string | undefined>;

    return (
      (!conditions.geo || conditions.geo === params.geo) &&
      (!conditions.device || conditions.device === params.device)
    );
  }

  private async selectByProbability(nodes: TreeNodeEntity[]): Promise<TreeNodeEntity | null> {
    if (nodes.length === 0) return null;

    const probabilityPromises = nodes.map((node) =>
      this.redis.get(`probability:${node.id}`).then((probabilityString) => {
        return { node, probability: parseFloat(probabilityString || node.probability.toString()) };
      })
    );

    const nodeProbabilities = await Promise.all(probabilityPromises);
    const rand = Math.random();
    let cumulative = 0;

    for (const { node, probability } of nodeProbabilities) {
      cumulative += probability;
      if (rand <= cumulative) {
        return node;
      }
    }

    return nodes[nodes.length - 1];
  }

  async clearOldCache(): Promise<void> {
    try {
      const keys = await this.redis.keys('adset:*');
      for (const key of keys) {
        await this.redis.del(key);
      }
    } catch (error) {
      console.error('Error clearing old cache:', error);
    }
  }
}
