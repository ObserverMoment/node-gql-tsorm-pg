import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import Organisation from '../Organisation'
import ShipmentCost from './ShipmentCost'
import ProductLine from './ProductLine'

@Entity()
export default class Container {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    Name: string

    @Column()
    notes: string

    @Column()
    totalCbm: number

    @ManyToOne(() => Organisation, organisation => organisation.shipments)
    @JoinColumn()
    organisation: Organisation
    // Adding explicit id columns for relationships allows for creation of relationships via passing just an id.
    // Saving unnecessary DB calls to retrieve actual relation object instances to then check their id.
    @Column({ type: 'int' })
    organisationId: number

    @OneToMany(() => ShipmentCost, shipmentCost => shipmentCost.shipment)
    shipmentCosts: ShipmentCost[]

    @OneToMany(() => ProductLine, productLine => productLine.catalogueItem)
    productLines: ProductLine[]
}
