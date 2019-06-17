import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import Role from './Role'
import CatalogueItem from './CatalogueItem'

@Entity()
export default class Organisation {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column()
  description: string

  @OneToMany(() => Role, role => role.organisation)
  roles: Role[]

  @OneToMany(() => CatalogueItem, catalogueItem => catalogueItem.organisation)
  catalogueItems: CatalogueItem[]
}
