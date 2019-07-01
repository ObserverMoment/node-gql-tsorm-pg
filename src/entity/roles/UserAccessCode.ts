import {Entity, Column, OneToOne, JoinColumn} from 'typeorm'
import CommonEntity from '../CommonEntity'
import User from './User'

@Entity()
export default class UserAccessCode extends CommonEntity {
    @Column()
    token: string

    // Access codes are valid for 5 minutes - could be less?
    @Column({type: 'timestamp', default: () => `NOW() + (5 * interval '1 minute')`})
    expiry: string

    @Column({type: 'int', default: 0})
    valid: number

    @OneToOne(() => User, user => user.userAccessCode)
    @JoinColumn()
    user: User
}
