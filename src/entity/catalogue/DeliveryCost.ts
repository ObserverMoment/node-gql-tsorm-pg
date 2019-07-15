import {Entity, Column, JoinColumn, ManyToOne} from 'typeorm'
import CommonEntity from '../CommonEntity'
import CatalogueItem from './CatalogueItem'
import DeliveryArea from './DeliveryArea'

// Delivery cost per catalogue item and per are (DeliveryArea). E.g. Product xx shippd to France
@Entity()
export default class DeliveryCost extends CommonEntity {
    @Column({type: 'float'})
    cost: number // Currency selectable globally (TODO)

    @Column()
    courierName: string

    @Column({type: 'int'})
    timescale: number // Days

    @ManyToOne(() => CatalogueItem, catalogueItem => catalogueItem.deliveryCosts)
    @JoinColumn()
    catalogueItem: CatalogueItem
    @Column()
    catalogueItemId: number

    @ManyToOne(() => DeliveryArea, deliveryArea => deliveryArea.deliveryCosts)
    @JoinColumn()
    deliveryArea: DeliveryArea
    @Column()
    deliveryAreaId: number
}
