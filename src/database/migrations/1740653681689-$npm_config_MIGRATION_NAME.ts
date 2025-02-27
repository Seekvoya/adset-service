import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigMIGRATIONNAME1740653681689 implements MigrationInterface {
    name = ' $npmConfigMIGRATIONNAME1740653681689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "node_probabilities" ("id" SERIAL NOT NULL, "nodeId" integer NOT NULL, "probability" double precision NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_406c84f7337216a7dc9f88b4f00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tree_node" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "conditions" jsonb NOT NULL DEFAULT '{}', "probability" double precision NOT NULL, "type" character varying NOT NULL, "cumulative_probability" double precision, "parent_id" integer, CONSTRAINT "PK_52408fd2fc57f06b5a6a4585ff9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tree_node" ADD CONSTRAINT "FK_17f364e6c68dca1bea902fc1aa4" FOREIGN KEY ("parent_id") REFERENCES "tree_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree_node" DROP CONSTRAINT "FK_17f364e6c68dca1bea902fc1aa4"`);
        await queryRunner.query(`DROP TABLE "tree_node"`);
        await queryRunner.query(`DROP TABLE "node_probabilities"`);
    }

}
