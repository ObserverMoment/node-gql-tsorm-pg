import {Entity, Column, JoinColumn, ManyToOne} from 'typeorm'
import CommonEntity from '../CommonEntity'
import SalesChannel from './SalesChannel'

@Entity()
export default class SalesChannelCost extends CommonEntity {
    @Column()
    name: string

    @Column()
    description: string

    @Column({type: 'float'})
    cost: number // Currency will be selectable in global config

    @ManyToOne(() => SalesChannel, salesChannel => salesChannel.salesChannelCosts)
    @JoinColumn()
    salesChannel: SalesChannel
}
