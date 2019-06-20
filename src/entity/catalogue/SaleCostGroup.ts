import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import CommonEntity from '../CommonEntity'
import Organisation from '../Organisation'
import SaleCost from './SaleCost'

@Entity()
export default class SaleCostGroup extends CommonEntity {
    @Column()
    name: string

    @Column()
    description: string

    @ManyToOne(() => Organisation, organisation => organisation.saleCostGroups)
    @JoinColumn()
    organisation: Organisation
    @Column({ type: 'int' })
    organisationId: number

    @OneToMany(() => SaleCost, saleCost => saleCost.saleCostGroup, { cascade: true })
    saleCosts: SaleCost[]
}
