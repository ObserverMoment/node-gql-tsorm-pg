import { Entity, Column, JoinColumn, ManyToMany, ManyToOne } from 'typeorm'
import CommonEntity from '../CommonEntity'
import Shipment from './Shipment'
import ShipmentCostGroup from './ShipmentCostGroup'

@Entity()
export default class ShipmentCost extends CommonEntity {
    @Column()
    name: string

    @Column()
    description: string

    @Column({ type: 'float' })
    cost: number // Currency will be selectable in global config

    @ManyToOne(
      () => ShipmentCostGroup,
      shipmentCostGroup => shipmentCostGroup.shipmentCosts,
      { cascade: true, onDelete: 'CASCADE' }
    )
    @JoinColumn()
    shipmentCostGroup: ShipmentCostGroup
    @Column()
    shipmentCostGroupId: number

    @ManyToMany(() => Shipment, shipment => shipment.shipmentCosts)
    shipments: Shipment[]
}
