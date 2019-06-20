import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import Organisation from '../Organisation'
import SaleCost from './SaleCost'

@Entity()
export default class SaleCostGroup {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @ManyToOne(() => Organisation, organisation => organisation.saleCostGroups)
    @JoinColumn()
    organisation: Organisation
    @Column({ type: 'int' })
    organisationId: number

    @OneToMany(() => SaleCost, saleCost => saleCost.saleCostGroup)
    saleCosts: SaleCost[]
}
