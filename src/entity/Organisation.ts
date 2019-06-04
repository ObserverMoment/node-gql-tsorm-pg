import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { User } from './User'
import { CatalogueItem } from './CatalogueItem'

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @OneToMany(() => User, user => user.organisation)
  users: User[]

  @OneToMany(() => CatalogueItem, catalogueItem => catalogueItem.organisation)
  catalogueItems: CatalogueItem[]
}
