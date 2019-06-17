import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import Organisation from './Organisation'
import User from './User'
import RoleType from './RoleType'

@Entity()
export default class Role {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => RoleType, roleType => roleType.roles)
    @JoinColumn()
    roleType: RoleType

    @ManyToOne(() => Organisation, organisation => organisation.roles)
    @JoinColumn()
    organisation: Organisation

    @ManyToOne(() => User, user => user.roles)
    @JoinColumn()
    user: User
}
