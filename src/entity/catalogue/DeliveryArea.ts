import {Entity, Column, OneToMany} from 'typeorm'
import CommonEntity from '../CommonEntity'
import DeliveryCost from './DeliveryCost'

@Entity()
export default class DeliveryArea extends CommonEntity {
    @Column()
    name: string // usually country name.

    @Column()
    area: string // Optional - if offshore or extended area.

    @Column()
    code: string // Optional country code. E.g. GB.

    @OneToMany(() => DeliveryCost, deliveryCost => deliveryCost.deliveryArea)
    deliveryCosts: DeliveryCost[]
}
