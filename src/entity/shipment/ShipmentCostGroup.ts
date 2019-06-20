import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import Organisation from '../Organisation'
import ShipmentCost from './ShipmentCost'

@Entity()
export default class ShipmentCostGroup {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @ManyToOne(() => Organisation, organisation => organisation.shipmentCostGroups)
    @JoinColumn()
    organisation: Organisation
    @Column({ type: 'int' })
    organisationId: number

    @OneToMany(() => ShipmentCost, shipmentCost => shipmentCost.shipmentCostGroup)
    shipmentCosts: ShipmentCost[]
}
