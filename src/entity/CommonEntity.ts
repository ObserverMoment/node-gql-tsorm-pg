import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export default class CommonEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
