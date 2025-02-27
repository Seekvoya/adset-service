import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

type BaseEntityTypeWithDatesColumns = { createdAt: Date; updatedAt: Date };
type BaseEntityTypeWithDatesAndIdColumns = BaseEntityTypeWithDatesColumns & { id: string };

export type BaseEntityType<WithId extends boolean> = WithId extends true
  ? BaseEntityTypeWithDatesAndIdColumns
  : BaseEntityTypeWithDatesColumns;

export class BaseEntityWithDatesColumns extends BaseEntity implements BaseEntityType<false> {
  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'LOCALTIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'LOCALTIMESTAMP',
  })
  updatedAt: Date;
}

export class BaseEntityWithDatesAndIdColumns
  extends BaseEntityWithDatesColumns
  implements BaseEntityType<true>
{
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export class BaseEntityWithId extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}