import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import Role from './roles/Role'
import CatalogueItem from './catalogue/CatalogueItem'
import Shipment from './shipment/Shipment'
import SaleCostGroup from './catalogue/SaleCostGroup'
import ShipmentCostGroup from './shipment/ShipmentCostGroup'

@Entity()
export default class Organisation {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column()
  description: string

  @OneToMany(() => Role, role => role.organisation)
  roles: Role[]

  @OneToMany(() => CatalogueItem, catalogueItem => catalogueItem.organisation)
  catalogueItems: CatalogueItem[]

  @OneToMany(() => Shipment, shipments => shipments.organisation)
  shipments: Shipment[]

  @OneToMany(() => SaleCostGroup, salecostGroup => salecostGroup.organisation)
  saleCostGroups: SaleCostGroup[]

  @OneToMany(() => ShipmentCostGroup, shipmentCostGroup => shipmentCostGroup.organisation)
  shipmentCostGroups: ShipmentCostGroup[]
}
