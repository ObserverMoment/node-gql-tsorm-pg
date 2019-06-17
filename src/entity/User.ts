import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import Role from './Role'

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    tokenValidAfter: Date

    @OneToMany(() => Role, role => role.user)
    roles: Role[]
}
