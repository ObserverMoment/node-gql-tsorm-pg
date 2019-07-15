import {Entity, Column, OneToMany} from 'typeorm'
import CommonEntity from '../CommonEntity'
import SalesChannelCost from './SalesChannelCost'

@Entity()
export default class SalesChannel extends CommonEntity {
    @Column()
    name: string

    @Column()
    description: string

    @Column()
    currency: string

    @OneToMany(() => SalesChannelCost, salesChannelCost => salesChannelCost.salesChannel)
    salesChannelCosts: SalesChannelCost[]
}
