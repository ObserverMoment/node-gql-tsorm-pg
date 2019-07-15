import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm'
import CommonEntity from '../CommonEntity'
import CatalogueItem from './CatalogueItem'
import VariantType from './VariantType'

// Only use for non cost affecting variations - eg colour. Sizes should have their own sku production, sales and shipping costs will vary.
@Entity()
export default class ItemVariant extends CommonEntity {
    @ManyToOne(() => VariantType, variantType => variantType.itemVariants)
    variantType: VariantType
    @Column({type: 'int'})
    variantTypeId: number

    @Column()
    skuSuffix: string // E.g the colour 'RED'

    @ManyToOne(() => CatalogueItem, catalogueItem => catalogueItem.itemVariants)
    @JoinColumn()
    catalogueItem: CatalogueItem
    // Adding explicit id columns for relationships allows for creation of relationships via passing just an id.
    // Saving unnecessary DB calls to retrieve actual relation object instances to then check their id.
    @Column({type: 'int'})
    catalogueItemId: number
}
