import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import CatalogueItem from '../catalogue/CatalogueItem'
import Shipment from './Shipment'

@Entity()
export default class ProductLine {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @Column({ type: 'float' })
    targetMargin: number // Between 0 and 1

    @ManyToOne(() => CatalogueItem, catalogueItem => catalogueItem.productLines)
    catalogueItem: CatalogueItem
    // Adding explicit id columns for relationships allow for creation of relationships via passing just an id.
    // Saving unnecessary DB calls to retrieve actual relation object instances.
    @Column({ type: 'int' })
    catalogueItemId: number

    @ManyToOne(() => Shipment, shipment => shipment.productLines)
    shipment: Shipment

    @Column({ type: 'int' })
    shipmentId: number
}
