import { SchemaDirectiveVisitor } from 'apollo-server'
import { defaultFieldResolver } from 'graphql'

export default class extends SchemaDirectiveVisitor {
  visitFieldDefinition (field, details) {
    console.log('field', field)
    const requiredRole = this.args.requires

    const { resolve = defaultFieldResolver } = field

    field.resolve = async function (...args) {
      // Does the user have access to data from the organisation that owns the data?
      const input = args[1]
      const context = args[2]
      // Check role is sufficient, also check if user is part of the organisation that owns the object we are retrieving.
      if (!requiredRole) {
        return resolve.apply(this, args)
      }
    }
  }

  ensureFieldsWrapped (objectType) {
    console.log('objectType', objectType)
    if (objectType.fieldsWrappd) return null
    objectType.fieldsWrapped = true

    const fields = objectType.getFields()
    console.log('fields', fields)
  }
}

// export default class extends SchemaDirectiveVisitor {
//   visitFieldDefinition (field, details) {
//     console.log('field', field)
//     console.log('details', details)
//     this.ensureFieldsWrapped(details.objectType)
//     field._requiredAuthRole = this.args.requires
//   }
//
//   ensureFieldsWrapped (objectType) {
//     console.log('objectType', objectType)
//     if (objectType.fieldsWrappd) return null
//     objectType.fieldsWrapped = true
//
//     const fields = objectType.getFields()
//     console.log('fields', fields)
//   }
// }
