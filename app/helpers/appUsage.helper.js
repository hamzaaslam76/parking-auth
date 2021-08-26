'use strict'
const db = require('../config/sequelize.config')
const generalHelpingMethods = require('./general.helper')
const _ = require('lodash')

const addAppLastUsed = (id, data) => {
  return db.User.findOne({
    where: {
      id: id,
      isDeleted: false
    }
  })
    .then((user) => {
      if (_.isEmpty(user)) {
        // User not found, return error
        return generalHelpingMethods.rejectPromise([{
          field: 'id',
          error: 1572,
          message: 'User not found.'
        }])
      }

      // insert usage
      return db.AppUsage.bulkCreate(data)
    })
}

// get app last used
function getAppLastUsed (conditions) {
  const where = [' UserId IN (' + conditions.userIds.join(', ') + ') ']
  let query = 'SELECT * FROM AppUsages '

  if (conditions.start) {
    where.push(' DATE(start) >= :start')
  }

  if (conditions.end) {
    where.push(' DATE(start) <= :end')
  }

  if (where.length) {
    query = query + ' WHERE ' + where.join(' AND ')
  }

  query += ` ORDER BY id DESC`

  return db.sequelize.query(query, {
    replacements: conditions,
    type: db.sequelize.QueryTypes.SELECT
  })
}

// get app last used
function getAppLastUsedGrouped (conditions) {
  const subQueryWhere = []
  const where = []
  let subQuery = `SELECT MAX(id) FROM AppUsages `

  if (conditions.userIds && conditions.userIds.length > 0) {
    subQueryWhere.push(' UserId IN (' + conditions.userIds.join(', ') + ') ')
  }

  if (conditions.start) {
    subQueryWhere.push(' DATE(`start`) >= :start')
  }

  if (conditions.end) {
    subQueryWhere.push(' DATE(`start`) <= :end')
  }

  if (subQueryWhere.length) {
    subQuery = subQuery + ' WHERE ' + subQueryWhere.join(' AND ')
    subQuery += ` GROUP BY UserId `

    where.push(` au.id IN (${subQuery}) `)
  }

  let query = 'SELECT au.id, au.UserId, u.fName, u.lName, u.email, `start`, `end` from AppUsages as au ' +
                ' INNER JOIN Users as u ON u.id=au.UserId '

  if (conditions.RoleId) {
    where.push(' RoleId = :RoleId')
  }

  if (conditions.interneeSupervisors) {
    query = query + ` INNER JOIN Internees AS i ON u.id=i.UserId
                      INNER JOIN InterneeBatches AS ib ON i.id=ib.InterneeId `
    where.push(' ib.SupervisorId IN (' + conditions.interneeSupervisors.join(', ') + ') AND ib.isDeleted=0 ')
  }

  if (where.length) {
    query = query + ' WHERE ' + where.join(' AND ')
  }

  query += ` ORDER BY au.start DESC`

  return db.sequelize.query(query, {
    replacements: conditions,
    type: db.sequelize.QueryTypes.SELECT
  })
    .then(async (data) => {
      if (data && conditions.history) {
        let historyWhere = []
        if (conditions.start) {
          historyWhere.push(` DATE(start) >= :start`)
        }
        if (conditions.end) {
          historyWhere.push(` DATE(start) <= :end`)
        }

        for (let i = 0; i < data.length; i++) {
          let historyQuery = `SELECT au.id, UserId, \`start\`, \`end\`, TIMESTAMPDIFF(SECOND, \`start\`, \`end\`)/60 AS difference from AppUsages as au WHERE `
          if (historyWhere.length) {
            historyQuery += historyWhere.join(' AND ')
            historyQuery += ' AND '
          }
          historyQuery += ` UserId = ${data[i]['UserId']} ORDER BY au.id DESC `

          await db.sequelize.query(historyQuery, {
            replacements: conditions,
            type: db.sequelize.QueryTypes.SELECT
          })
            .then((result) => {
              data[i]['history'] = result
            })
        }
      }
      return data
    })
}

module.exports = {
  addAppLastUsed,
  getAppLastUsed,
  getAppLastUsedGrouped
}
