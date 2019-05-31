import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class ProductTemplate {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    brand: string

    @Column()
    identifier: string

    @ManyToOne(() => User, user => user.productTemplates)
    @JoinColumn()
    user: User
}
