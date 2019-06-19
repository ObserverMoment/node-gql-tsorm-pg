import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import Role from './Role'

@Entity()
export default class RoleType {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    roleName: string

    @OneToMany(() => Role, role => role.roleType)
    roles: Role[]
}
