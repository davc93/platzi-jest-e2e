const request = require('supertest');
const createApp = require('../src/app')
const {models} = require('../src/db/sequelize')

const { upSeed,downSeed } = require('./utils/umzug');
describe('tests for users', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {

    app = createApp()
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });


  describe('For GET /users/{id}', () => {

    test('should return a user', async () => {
      // arrange
      const user = await models.User.findByPk('1')
      //act
      const {statusCode,body} = await api.get(`/api/v1/users/${user.id}`)
      expect(statusCode).toBe(200)
      expect(body.id).toBe(user.id)
      expect(body.email).toBe(user.email)


    })
  })

  describe('For POST Users', () => {


    test('should return a bad request with invalid password', async () => {
      // Arrange
      const inputData = {

        email:"nicolas@mail.com",
        password:"-----"
      }
      //Act

      const {statusCode,body} = await api.post('/api/v1/users').send(inputData)


      //Assertion

      expect(statusCode).toEqual(400)
      expect(body.message).toMatch(/password/)
    })
    test('should return a bad request with invalid email', async () => {
      // Arrange
      const inputData = {

        email:"------",
        password:"password123"
      }
      //Act

      const {statusCode,body} = await api.post('/api/v1/users').send(inputData)


      //Assertion

      expect(statusCode).toEqual(400)

      expect(body.message).toMatch(/email/)
    })
    test('should return a User', async () => {
      // Arrange


      const inputData = {

        email:"pepito@gmail.com",
        password:"password123"
      }
      //Act

      const {statusCode,body} = await api.post('/api/v1/users').send(inputData)
      const user = await models.User.findByPk(body.id)

      //Assertion
      expect(statusCode).toBe(201)
      expect(user).toBeTruthy()
      expect(user.role).toEqual('admin')
      expect(user.email).toEqual(inputData.email)
    })
  })

  describe('For PUT Users', () => {  })

  describe('For DELETE Users', () => {})
  afterAll(async ()=>{
    await downSeed()
    server.close()
  })
});
