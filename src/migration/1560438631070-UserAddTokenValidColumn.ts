import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm'

export class UserAddTokenValidColumn1560438631070 implements MigrationInterface {
  async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('user', new TableColumn({
      name: 'tokenValidAfter',
      type: 'timestamp',
      default: 'now()'
    }))
  }

  async down (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user', 'tokenValidAfter')
  }
}
