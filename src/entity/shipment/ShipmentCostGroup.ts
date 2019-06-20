import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import CommonEntity from '../CommonEntity'
import Organisation from '../Organisation'
import ShipmentCost from './ShipmentCost'

@Entity()
export default class ShipmentCostGroup extends CommonEntity {
    @Column()
    name: string

    @Column()
    description: string

    @ManyToOne(() => Organisation, organisation => organisation.shipmentCostGroups)
    @JoinColumn()
    organisation: Organisation
    @Column({ type: 'int' })
    organisationId: number

    @OneToMany(() => ShipmentCost, shipmentCost => shipmentCost.shipmentCostGroup, { cascade: true })
    shipmentCosts: ShipmentCost[]
}
