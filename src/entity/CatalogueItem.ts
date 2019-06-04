import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Organisation } from './Organisation'

@Entity()
export class CatalogueItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    title: string

    @Column()
    cbm: number

    @Column()
    productNotes: string

    @Column()
    packagingNotes: string

    @ManyToOne(() => Organisation, organisation => organisation.catalogueItems)
    @JoinColumn()
    organisation: Organisation
}
