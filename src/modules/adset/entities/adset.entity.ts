import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('tree_node')
export class TreeNodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TreeNodeEntity, (node) => node.id, { nullable: true })
  @JoinColumn({name: 'parent_id'})
  parent: number | null;

  @Column()
  name: string;

  @Column({ type: 'jsonb', default: '{}' })
  conditions: Record<string, any>;

  @Column({ type: 'float' })
  probability: number;

  @Column()
  type: string;

  @Column({ type: 'float', nullable: true, name: 'cumulative_probability' })
  cumulativeProbability: number;
}
