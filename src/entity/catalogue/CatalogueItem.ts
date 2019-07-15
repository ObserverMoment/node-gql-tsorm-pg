import {Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable} from 'typeorm'
import CommonEntity from '../CommonEntity'
import Organisation from '../Organisation'
import Parcel from './Parcel'
import ItemVariant from './ItemVariant'
import ProductLine from '../shipment/ProductLine'
import DeliveryCost from './DeliveryCost'
import SaleCost from './SaleCost'

@Entity()
export default class CatalogueItem extends CommonEntity {
    @Column()
    code: string

    @Column()
    title: string

    @Column()
    productNotes: string

    @Column()
    packagingNotes: string

    @Column({type: 'timestamp', nullable: true})
    archivedOn: number

    @ManyToOne(() => Organisation, organisation => organisation.catalogueItems)
    @JoinColumn()
    organisation: Organisation
    // Adding explicit id columns for relationships allows for creation of relationships via passing just an id.
    // Saving unnecessary DB calls to retrieve actual relation object instances to then check their id.
    @Column({type: 'int'})
    organisationId: number

    @OneToMany(() => ItemVariant, itemVariant => itemVariant.catalogueItem)
    itemVariants: ItemVariant[]

    @OneToMany(() => Parcel, parcel => parcel.catalogueItem)
    parcels: Parcel[]

    @OneToMany(() => ProductLine, productLine => productLine.catalogueItem)
    productLines: ProductLine[]

    @OneToMany(() => DeliveryCost, deliveryCost => deliveryCost.catalogueItem)
    deliveryCosts: DeliveryCost[]

    @ManyToMany(() => SaleCost, saleCost => saleCost.catalogueItems)
    @JoinTable({name: 'catalogue_item_sale_costs'})
    saleCosts: SaleCost[]
}
