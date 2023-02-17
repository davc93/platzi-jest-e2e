const request = require('supertest');
const createApp = require('../src/app')
const {models} = require('../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for Profile', () => {
  let app = null;
  let server = null;
  let api = null;
  let access_token = null
  let user = null
  beforeAll(async () => {

    app = createApp()
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });


  describe('For GET /my-user', () => {

    beforeAll(async ()=>{
      user = await models.User.findByPk('1')

      const inputData ={
        email:user.email,
        password:'admin123'
      }//act
      const {body} = await api.post(`/api/v1/auth/login`).send(inputData)
      access_token = body.access_token

    })


    test('should return a 401', async () => {
      // arrange
      const {statusCode} = await api.get('/api/v1/profile/my-user').set({
        'Authorization':`Bearer 2123`
      })
      //act
      expect(statusCode).toBe(401)


    })
    test('should return a 200', async () => {
      // arrange



      const {statusCode,body:{email}} = await api.get('/api/v1/profile/my-user').set({
        'Authorization':`Bearer ${access_token}`
      })
      //assertion
      expect(statusCode).toBe(200)
      expect(email).toBe(user.email)

    })
  })

  afterAll(async ()=>{
    access_token = null
    user = null
    await downSeed()
    server.close()
  })
});
