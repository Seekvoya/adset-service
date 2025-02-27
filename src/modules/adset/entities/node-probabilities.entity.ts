import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('node_probabilities')
export class NodeProbabilityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nodeId: number;

  @Column({ type: 'float' })
  probability: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
