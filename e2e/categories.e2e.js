const request = require('supertest');
const createApp = require('../src/app')
const {models} = require('../src/db/sequelize')

const { upSeed,downSeed } = require('./utils/umzug');
describe('tests for auth', () => {
  let app = null;
  let server = null;
  let api = null;
  let user
  let inputUser
  let access_token

  beforeAll(async () => {

    app = createApp()
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });


  describe('POST /categories with admin users', () => {

    beforeAll(async ()=>{
      user = await models.User.findByPk('1')
      console.log(user)
      inputUser ={
        email:user.email,
        password:'admin123'
      }//act
      const {body} = await api.post('/api/v1/auth/login').send(inputUser)
      access_token = body.access_token
    })

    test('should return 401', async () => {
      // arrange
      const inputData ={
        name:'Categoria nueva',
        image:'https://api.lorem.space/image/game?w=150&h=220'

      }


      //act

      const {statusCode} = await api.post('/api/v1/categories').send(inputData)
      // assertions
      expect(statusCode).toBe(401)
    })
    test('should return a new cateogry', async () => {
      // arrange
      const inputData ={
        name:'Categoria nueva',
        image:'https://api.lorem.space/image/game?w=150&h=220'

      }


      //act

      const {statusCode,body} = await api.post('/api/v1/categories').set({'Authorization':`Bearer ${access_token}`}).send(inputData)
      // assertions
      expect(statusCode).toBe(201)
      const category = await models.Category.findByPk(body.id)
      expect(category.name).toEqual(inputData.name)

    })
    afterAll(()=>{
      user = null
      access_token=null
      inputUser = null
    })



  })

  describe('POST /categoires with customer users', () => {
    beforeAll(async ()=>{
      user = await models.User.findByPk('2')
      console.log(user)
      inputUser ={
        email:user.email,
        password:'customer123'
      }//act
      const {body} = await api.post('/api/v1/auth/login').send(inputUser)
      access_token = body.access_token
    })
    test('should return 401', async () => {
      // arrange
      const inputData ={
        name:'Categoria nueva',
        image:'https://api.lorem.space/image/game?w=150&h=220'

      }
      //act

      const {statusCode} = await api.post('/api/v1/categories').set({'Authorization':`Bearer ${access_token}`}).send(inputData)
      // assertions
      expect(statusCode).toBe(401)

    })

    afterAll(()=>{
      user = null
      access_token=null
      inputUser = null
    })



  })

  afterAll(async ()=>{
    access_token = null
    await downSeed()
    server.close()
  })
});
