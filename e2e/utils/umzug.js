const {Umzug,SequelizeStorage} = require('umzug')

const sequelize = require('./../../src/db/sequelize')
const {models} = sequelize

const umzug = new Umzug({
  migrations:{
    glob:'./src/db/seeders/*.js'
  },
  context:sequelize.getQueryInterface(),
  storage:new SequelizeStorage({sequelize}),
  logger:undefined
})


const upSeed = async () => {
  try {
    await sequelize.sync({force:true})
    await umzug.up()
  } catch (error) {
    console.error(error)
  }
}

const downSeed = async () => {

  try {
    await sequelize.drop()
  } catch (error) {
    console.error(error)
  }

}

module.exports = {
  upSeed,
  downSeed
}
