import {Entity, Column, JoinColumn, ManyToMany, ManyToOne} from 'typeorm'
import CommonEntity from '../CommonEntity'
import CatalogueItem from './CatalogueItem'
import SaleCostGroup from './SaleCostGroup'

@Entity()
export default class SaleCost extends CommonEntity {
    @Column()
    name: string

    @Column()
    description: string

    @Column({type: 'float'})
    amount: number // Currency will be selectable in global config

    @ManyToMany(() => CatalogueItem, catalogueItem => catalogueItem.saleCosts)
    catalogueItems: CatalogueItem[]

    @ManyToOne(
      () => SaleCostGroup,
      saleCostGroup => saleCostGroup.saleCosts,
      {cascade: true, onDelete: 'CASCADE'}
    )
    @JoinColumn()
    saleCostGroup: SaleCostGroup
    @Column()
    saleCostGroupId: number
}
