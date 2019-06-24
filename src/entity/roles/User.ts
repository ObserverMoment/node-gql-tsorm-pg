import { Entity, Column, OneToMany } from 'typeorm'
import CommonEntity from '../CommonEntity'
import Role from './Role'

@Entity()
export default class User extends CommonEntity {
    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column({ unique: true })
    email: string

    @Column({ select: false })
    password: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    tokenValidAfter: string

    @OneToMany(() => Role, role => role.user)
    roles: Role[]
}
