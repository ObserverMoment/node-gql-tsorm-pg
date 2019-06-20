import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import CatalogueItem from './CatalogueItem'

@Entity()
export default class Parcel {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'float' })
    length: string // mm

    @Column({ type: 'float' })
    width: string // mm

    @Column({ type: 'float' })
    height: number // mm

    @Column({ type: 'float' })
    weight: string // kg

    @Column()
    notes: string

    @ManyToOne(() => CatalogueItem, catalogueItem => catalogueItem.parcels)
    @JoinColumn()
    catalogueItem: CatalogueItem
    // Adding explicit id columns for relationships allows for creation of relationships via passing just an id.
    // Saving unnecessary DB calls to retrieve actual relation object instances to then check their id.
    @Column({ type: 'int' })
    catalogueItemId: number
}
