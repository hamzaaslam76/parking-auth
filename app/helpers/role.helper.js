'use strict'
const db = require('../config/sequelize.config')
const generalHelpingMethods = require('./general.helper')

// *****************************
// getRoleDetails against Id
// *****************************

function getRoleDetails (conditions) {
  conditions.isDeleted = false
  // conditions.isActive = true
  return db.Role.findOne({
    where: conditions,
    include: [
      {
        model: db.Permission,
        as: 'rolePermissions'
      }
    ]
  }).then((response) => {
    if (!response) {
      return {}
    }
    // response = JSON.parse(JSON.stringify(response))
    // // console.log(response.rolePermissions)
    // let RoleActionIds = []
    // let data = response.rolePermissions
    // for (let i = 0; i < data.length; i++) {
    //   let temp = data[i].RolePermission.ModuleActionId
    //   RoleActionIds.push(temp)
    // }
    // response['ModuleActionId'] = RoleActionIds
    return response
  })
    .catch(generalHelpingMethods.catchException)
}

// *****************************
// Get All Role
// *****************************

function getRoles (conditions) {
  const includes = []
  conditions.isDeleted = false

  if (conditions.id) {
    includes.push({
      model: db.Permission,
      as: 'rolePermissions'
    })
  }
  // conditions.isActive = true
  return db.Role.findAndCountAll({
    where: conditions,
    include: includes
  })
    .catch(generalHelpingMethods.catchException)
}

// ****************
// Add Role
// ****************

function addRole (roleData, moduleActionIds, UserId) {
  // Find role, if it is already exists or not
  return db.Role.findOne({ where: {
    title: roleData.title,
    isDeleted: false
  } })
    .then(role => {
      if (role) {
        // Role already found against same company
        // Return with error of role already exists
        return generalHelpingMethods.rejectPromise([{
          field: 'title',
          error: 5507,
          message: 'Role with same title already exists.'
        }])
      }

      // Create new role
      return db.Role.create(roleData)
    })
    .then(createdRole => {
      // return created role
      if (createdRole) {
        // add areas
        const roles = []
        for (let i = 0; i < moduleActionIds.length; i++) {
          roles.push({
            RoleId: createdRole.id,
            ModuleActionId: moduleActionIds[i]
          })
        }
        db.Permission.bulkCreate(roles)
      }
      return createdRole
    })
    .catch(generalHelpingMethods.catchException)
}

// **************
// update Role
// **************

function updateRole (role, moduleActionIds, id) {
  console.log('=====>', id, role, moduleActionIds)
  return db.Role.findOne({
    id: id,
    isDeleted: false
  })
    .then((dbRole) => {
      if (!dbRole) {
        // No role found to update, return error.
        return generalHelpingMethods.rejectPromise([{
          field: '',
          error: 5548,
          message: 'No role found to update.'
        }])
      }

      if (moduleActionIds) {
        db.Permission.destroy({ where: { RoleId: id } })
          .then(() => {
            // add permissions
            const roles = []
            for (let i = 0; i < moduleActionIds.length; i++) {
              roles.push({
                RoleId: id,
                ModuleActionId: moduleActionIds[i]
              })
            }
            db.Permission.bulkCreate(roles)
          })
      }

      if (role) {
        return db.Role.update(role, { returning: true, where: { id: id } })
      }

      return dbRole
    })
    .catch(generalHelpingMethods.catchException)
}

// ***************
// Delete Role
// ***************

function deleteRole (userId, roleId) {
  const id = roleId.id
  return db.User.findOne({ where: {
    id: userId,
    isDeleted: false
  } })
    .then(user => {
      // Check user enter a valid password or not
      if (!user) {
        return generalHelpingMethods.rejectPromise([{
          field: '',
          error: 5553,
          message: 'Invalid password.'
        }])
      }

      // Find role
      return db.Role.findOne({ where: {
        id: id,
        isDeleted: false
      } })
    })
    .then(role => {
      if (!role) {
        // No role found to delete, return error.
        return generalHelpingMethods.rejectPromise([{
          field: '',
          error: 5546,
          message: 'No role found to delete.'
        }])
      }

      // Role found, update role isDelete to true and save.
      role.isDeleted = true
      role.save()

      // Return role
      return role
    })
    .catch(generalHelpingMethods.catchException)
}

module.exports = {
  addRole,
  getRoles,
  updateRole,
  deleteRole,
  getRoleDetails
}
