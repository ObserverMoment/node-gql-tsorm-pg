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

    // Add this one minute early to allow for the fact that there is latency when registering a new user.
    // I.e. the first JWT is generated (on successful registration) very fast but the DB write takes some time!
    @Column({ type: 'timestamp', select: false, default: () => `NOW() - INTERVAL '1 minute'` })
    tokenValidAfter: string

    @OneToMany(() => Role, role => role.user)
    roles: Role[]
}
