import { Entity, Column, OneToOne } from 'typeorm'
import CommonEntity from '../CommonEntity'
import ShipmentPayment from './ShipmentPayment'

@Entity()
export default class CurrencyExchange extends CommonEntity {
    @Column()
    baseAmount: string

    @Column()
    baseCurrency: string

    @Column()
    quoteCurrency: string

    @Column({ type: 'float' })
    exchangeRate: number

    @OneToOne(() => ShipmentPayment, shipmentPayment => shipmentPayment.currencyExchange)
    shipmentPayment: ShipmentPayment
}
