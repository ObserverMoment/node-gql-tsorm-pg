import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm'
import Shipment from './Shipment'
import ShipmentCostGroup from './ShipmentCostGroup'

@Entity()
export default class ShipmentCost {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column({ type: 'float' })
    cost: number // Currency will be selectable in global config

    @ManyToOne(() => ShipmentCostGroup, shipmentCostGroup => shipmentCostGroup.shipmentCosts)
    shipmentCostGroup: ShipmentCostGroup
    @Column()
    shipmentCostGroupId: number

    @ManyToMany(() => Shipment, shipment => shipment.shipmentCosts)
    shipments: Shipment[]
}
