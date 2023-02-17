const request = require('supertest');
const createApp = require('../src/app')
const {models} = require('../src/db/sequelize')
const { upSeed,downSeed } = require('./utils/umzug');


describe('tests for products', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {

    app = createApp()
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });

  describe('GET /products', () => {

    test('should return products', async () => {
      //act
      const {statusCode,body} = await api.get('/api/v1/products')
      expect(statusCode).toBe(200)
      const products = await models.Product.findAll()
      expect(body.length).toEqual(products.length)
      expect(body[0].category).toBeTruthy()

    })

    test('should return products with limits and offset', async () => {
      const limit = 2
      const offset = 0

      const {statusCode,body} = await api.get(`/api/v1/products?limit=${limit}&offset=${offset}`)
      expect(statusCode).toBe(200)
      expect(body.length).toEqual(limit)

    })


  })


  afterAll(async ()=>{
    await downSeed()
    server.close()
  })
});
