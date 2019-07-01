import {Entity, Column, OneToMany} from 'typeorm'
import CommonEntity from '../CommonEntity'
import Role from './Role'

@Entity()
export default class RoleType extends CommonEntity {
    @Column()
    roleName: string

    @OneToMany(() => Role, role => role.roleType)
    roles: Role[]
}
