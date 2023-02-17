const request = require('supertest');
const createApp = require('../src/app');
const { config } = require('../src/config/config');
const { upSeed,downSeed } = require('./utils/umzug');

describe('tests for app', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {

    app = createApp()
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });

  test('GET hello', async () => {
    const response = await api.get('/');

    expect(response).toBeTruthy();
    expect(response.statusCode).toEqual(200);
  });
  describe('GET /nueva-ruta', () => {
    test('should return 401', async () => {
      const {statusCode} = await api.get('/nueva-ruta')
      expect(statusCode).toBe(401)
    });
    test('should return 401 with invalid apikey', async () => {
      const {statusCode} = await api.get('/nueva-ruta').set({
        api:""
      })
      expect(statusCode).toBe(401)

    })
    test('should return 200', async () => {
      const {statusCode} = await api.get('/nueva-ruta').set({api:config.apiKey})
      expect(statusCode).toBe(200)
    })
  });

  afterAll(async ()=>{
    await downSeed()
    server.close()
  })
});
