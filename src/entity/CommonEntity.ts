import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export default class CommonEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
