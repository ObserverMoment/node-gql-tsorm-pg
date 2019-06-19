import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import Organisation from '../Organisation'
import Parcel from './Parcel'
import ProductLine from '../shipment/ProductLine'

@Entity()
export default class CatalogueItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    title: string

    @Column()
    productNotes: string

    @Column()
    packagingNotes: string

    @ManyToOne(() => Organisation, organisation => organisation.catalogueItems)
    @JoinColumn()
    organisation: Organisation
    // Adding explicit id columns for relationships allows for creation of relationships via passing just an id.
    // Saving unnecessary DB calls to retrieve actual relation object instances to then check their id.
    @Column({ type: 'int' })
    organisationId: number

    @OneToMany(() => Parcel, parcel => parcel.catalogueItem)
    parcels: Parcel[]

    @OneToMany(() => ProductLine, productLine => productLine.catalogueItem)
    productLines: ProductLine[]
}
