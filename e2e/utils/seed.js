const sequelize = require('./../../src/db/sequelize')
const {models} = sequelize


const upSeed = async () => {
  // create tables
  await sequelize.sync({force:true})
  const password = "admin123"

}

const downSeed = async () => {

  // drop all
  await sequelize.drop()
}


module.exports = {
  upSeed,
  downSeed
}
