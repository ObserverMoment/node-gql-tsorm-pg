import {Entity, Column, OneToMany, OneToOne} from 'typeorm'
import CommonEntity from '../CommonEntity'
import Role from './Role'
import UserAccessCode from './UserAccessCode'
import UserResetToken from './UserResetToken'

@Entity()
export default class User extends CommonEntity {
    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column({unique: true})
    email: string

    @Column({select: false})
    password: string

    // Add this one minute early to allow for the fact that there is latency when registering a new user.
    // I.e. the first JWT is generated (on successful registration) very fast but the DB write takes some time!
    @Column({type: 'timestamp', select: false, default: () => `NOW() - INTERVAL '1 minute'`})
    tokenValidAfter: string

    @Column({type: 'int', select: false, default: 0})
    accountLocked: number

    @Column({type: 'int', default: 0})
    twoFactorEnabled: number

    @OneToMany(() => Role, role => role.user)
    roles: Role[]

    @OneToOne(() => UserAccessCode, userAccessCode => userAccessCode.user)
    userAccessCode: UserAccessCode

    @OneToOne(() => UserResetToken, userResetToken => userResetToken.user)
    userResetToken: UserResetToken
}
