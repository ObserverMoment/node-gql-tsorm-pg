import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm'
import ProductLine from '../shipment/ProductLine'
import SaleCostGroup from './SaleCostGroup'

@Entity()
export default class SaleCost {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column({ type: 'float' })
    amount: number // Currency will be selectable in global config

    @ManyToMany(() => ProductLine, productLine => productLine.saleCosts)
    productLines: ProductLine[]

    @ManyToOne(() => SaleCostGroup, saleCostGroup => saleCostGroup.saleCosts)
    saleCostGroup: SaleCostGroup
    @Column()
    saleCostGroupId: number
}
