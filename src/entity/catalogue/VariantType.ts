import {Entity, Column, OneToMany} from 'typeorm'
import CommonEntity from '../CommonEntity'
import ItemVariant from './ItemVariant'

@Entity()
export default class VariantType extends CommonEntity {
    @Column()
    typeName: string // [Colour...?]

    @OneToMany(() => ItemVariant, itemVariant => itemVariant.variantType)
    itemVariants: ItemVariant[]
}
