import {Entity, JoinColumn, Column, ManyToOne} from 'typeorm'
import CommonEntity from '../CommonEntity'
import CatalogueItem from '../catalogue/CatalogueItem'
import Shipment from './Shipment'

@Entity()
export default class ProductLine extends CommonEntity {
    @Column()
    quantity: number

    @Column({type: 'float'})
    targetMargin: number // Between 0 and 1

    @ManyToOne(() => CatalogueItem, catalogueItem => catalogueItem.productLines)
    @JoinColumn()
    catalogueItem: CatalogueItem
    @Column({type: 'int'})
    catalogueItemId: number

    @ManyToOne(
      () => Shipment,
      shipment => shipment.productLines,
      {cascade: true, onDelete: 'CASCADE'}
    )
    @JoinColumn()
    shipment: Shipment
    @Column({type: 'int'})
    shipmentId: number
}
