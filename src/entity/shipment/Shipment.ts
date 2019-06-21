import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm'
import CommonEntity from '../CommonEntity'
import Organisation from '../Organisation'
import ShipmentCost from './ShipmentCost'
import ProductLine from './ProductLine'
import ShipmentPayment from './ShipmentPayment'

@Entity()
export default class Shipment extends CommonEntity {
    @Column()
    name: string

    @Column()
    notes: string

    @Column()
    totalCbm: number

    @Column({ type: 'timestamp', nullable: true })
    shippedOn: string

    @Column({ type: 'timestamp', nullable: true })
    archivedOn: string

    @ManyToOne(() => Organisation, organisation => organisation.shipments)
    @JoinColumn()
    organisation: Organisation
    @Column({ type: 'int' })
    organisationId: number

    @OneToMany(() => ProductLine, productLine => productLine.shipment)
    productLines: ProductLine[]

    @OneToMany(() => ShipmentPayment, shipmentPayment => shipmentPayment.shipment)
    shipmentPayments: ShipmentPayment[]

    @ManyToMany(() => ShipmentCost, shipmentCost => shipmentCost.shipments)
    @JoinTable({ name: 'shipment_shipment_costs' })
    shipmentCosts: ShipmentCost[]
}
