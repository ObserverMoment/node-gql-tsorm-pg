import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm'
import Organisation from '../Organisation'
import ShipmentCost from './ShipmentCost'
import ProductLine from './ProductLine'

@Entity()
export default class Shipment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    notes: string

    @Column()
    totalCbm: number

    @ManyToOne(() => Organisation, organisation => organisation.shipments)
    @JoinColumn()
    organisation: Organisation
    @Column({ type: 'int' })
    organisationId: number

    @OneToMany(() => ProductLine, productLine => productLine.catalogueItem)
    productLines: ProductLine[]

    @ManyToMany(() => ShipmentCost, shipmentCost => shipmentCost.shipments)
    @JoinTable({ name: 'shipment_shipment_costs' })
    shipmentCosts: ShipmentCost[]
}
