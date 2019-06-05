import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import Organisation from './Organisation'

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column()
    email: string

    @Column()
    password: string

    @ManyToOne(() => Organisation, organisation => organisation.users)
    @JoinColumn()
    organisation: Organisation
}
