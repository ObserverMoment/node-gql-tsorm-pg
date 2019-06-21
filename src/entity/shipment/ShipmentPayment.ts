import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm'
import CommonEntity from '../CommonEntity'
import Shipment from './Shipment'
import CurrencyExchange from './CurrencyExchange'

@Entity()
export default class ShipmentPayment extends CommonEntity {
    @Column()
    description: string

    @Column()
    paymentMethod: string

    @Column({ type: 'float' })
    amount: number

    @Column({ type: 'timestamp', nullable: true })
    paidOn: string

    @ManyToOne(() => Shipment, shipment => shipment.shipmentPayments)
    @JoinColumn()
    shipment: Shipment
    @Column({ type: 'int' })
    shipmentId: number

    @OneToOne(() => CurrencyExchange, currencyExchange => currencyExchange.shipmentPayment)
    @JoinColumn()
    currencyExchange: CurrencyExchange
    @Column({ type: 'int' })
    currencyExchangeId: number
}
