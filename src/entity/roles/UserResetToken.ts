import {Entity, Column, OneToOne, JoinColumn} from 'typeorm'
import CommonEntity from '../CommonEntity'
import User from './User'

@Entity()
export default class UserResetToken extends CommonEntity {
    @Column()
    token: string

    // Reset codes are valid for 1 day - could be less?
    @Column({type: 'timestamp', default: () => `NOW() - INTERVAL '1 day'`})
    expiry: string

    @Column({type: 'int', default: 0})
    valid: number

    @OneToOne(() => User, user => user.userResetToken)
    @JoinColumn()
    user: User
}
