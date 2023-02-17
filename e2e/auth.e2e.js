const request = require('supertest');
const createApp = require('../src/app')
const {models} = require('../src/db/sequelize')
const { upSeed,downSeed } = require('./utils/umzug');



const mockSendEmail = jest.fn()

jest.mock('nodemailer',()=>{
  return {
    createTransport:jest.fn().mockImplementation(()=>{
      return {
        sendMail:mockSendEmail
      }
    })
  }
})


describe('tests for auth', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    mockSendEmail.mockClear()
    app = createApp()
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });


  describe('For POST /login', () => {

    test('should return 401', async () => {
      // arrange
      const inputData ={
        email:"emailFake@gmail.com",
        password:"asdasdasd23"
      }


      //act

      const {statusCode} = await api.post('/api/v1/auth/login').send(inputData)
      expect(statusCode).toBe(401)
    })



    test('should return a 200', async () => {
      // arrange
      const user = await models.User.findByPk('1')
      console.log(user)
      const inputData ={
        email:user.email,
        password:'admin123'
      }//act
      const {statusCode,body} = await api.post(`/api/v1/auth/login`).send(inputData)
      expect(statusCode).toBe(200)
      expect(body.access_token).toBeTruthy()
      expect(body.user.email).toBe(inputData.email)
      expect(body.user.password).toBeUndefined()
    })
  })
  describe('POST /recovery', () => {

    test('should return 401', async () => {

      const inputData = {
        email:"asasd@gmail.com"
      }
      const {statusCode} = await api.post(`/api/v1/auth/recovery`).send(inputData)

      expect(statusCode).toBe(401)

    })
    test('should sendEmail', async () => {

      const user = await models.User.findByPk('1')
      const inputData = {
        email:user.email
      }

      mockSendEmail.mockResolvedValue(true)
      const {statusCode,body} = await api.post(`/api/v1/auth/recovery`).send(inputData)



      expect(statusCode).toBe(200)
      expect(body.message).toEqual('mail sent')
      expect(mockSendEmail).toHaveBeenCalled()
    })

  })

  afterAll(async ()=>{
    await downSeed()
    server.close()
  })
});
