import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import Organisation from './Organisation'

@Entity()
export default class User {
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

    @ManyToOne(() => Organisation, organisation => organisation.users)
    @JoinColumn()
    organisation: Organisation
}
