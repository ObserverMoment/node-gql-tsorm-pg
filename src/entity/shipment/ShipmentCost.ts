import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import Shipment from './Shipment'

@Entity()
export default class ShipmentCost {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    Name: string

    @Column()
    description: string

    @Column()
    cost: number

    @ManyToOne(() => Shipment, shipment => shipment.shipmentCosts)
    @JoinColumn()
    shipment: Shipment
    // Adding explicit id columns for relationships allows for creation of relationships via passing just an id.
    // Saving unnecessary DB calls to retrieve actual relation object instances to then check their id.
    @Column({ type: 'int' })
    shipmentId: number
}
