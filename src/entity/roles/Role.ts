import {Entity, Column, JoinColumn, ManyToOne} from 'typeorm'
import CommonEntity from '../CommonEntity'
import Organisation from '../Organisation'
import User from './User'
import RoleType from './RoleType'

@Entity()
export default class Role extends CommonEntity {
    @ManyToOne(() => RoleType, roleType => roleType.roles)
    roleType: RoleType
    // Adding explicit id columns for relationships allow for creation of relationships via passing just an id.
    // Saving unnecessary DB calls to retrieve actual relation object instances.
    @Column({type: 'int'})
    roleTypeId: number

    @ManyToOne(() => Organisation, organisation => organisation.roles)
    @JoinColumn()
    organisation: Organisation
    @Column({type: 'int'})
    organisationId: number

    @ManyToOne(() => User, user => user.roles)
    @JoinColumn()
    user: User
    @Column({type: 'int'})
    userId: number
}
