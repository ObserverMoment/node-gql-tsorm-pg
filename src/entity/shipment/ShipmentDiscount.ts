import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm'
import CommonEntity from '../CommonEntity'
import Shipment from './Shipment'

@Entity()
export default class ShipmentDiscount extends CommonEntity {
    @Column()
    name: string

    @Column()
    description: string

    @Column({type: 'float'})
    amount: number

    @ManyToOne(() => Shipment, shipment => shipment.shipmentDiscounts)
    @JoinColumn()
    shipment: Shipment
    @Column({type: 'int'})
    shipmentId: number
}
