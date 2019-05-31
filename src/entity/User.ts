import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm'
import { UserType } from './UserType'
import { ProductTemplate } from './ProductTemplate'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    passwordDigest: string

    @ManyToOne(() => UserType, userType => userType.users)
    @JoinColumn()
    userType: UserType

    @OneToMany(() => ProductTemplate, productTemplate => productTemplate.user)
    productTemplates: ProductTemplate[]
}
