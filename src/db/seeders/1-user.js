const bcrypt = require('bcrypt');
const { USER_TABLE } = require('./../models/user.model');

module.exports = {
  up: async (queryInterface) => {
    if(queryInterface.context){
      queryInterface = queryInterface.context
    }
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    return queryInterface.bulkInsert(USER_TABLE, [{
      email: 'admin@mail.com',
      password: hash,
      role: 'admin',
      created_at: new Date()
    },{
      email:"customer@mail.com",
      password: await bcrypt.hash('customer123',10),
      role:"customer",
      created_at:new Date()

    }]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(USER_TABLE, null, {});
  }
};
