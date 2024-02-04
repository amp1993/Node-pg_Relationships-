const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { createData } = require('../_test-common');

// Connect to testing environment
process.env.NODE_ENV = 'test';

// Connect to the database before each test
beforeEach(createData);

// Close the database connection after all tests
afterAll(async function () {
  await db.end();
});

// Test get all companies
describe('GET /', function () {
  it('should get list of all companies', async function () {
    const response = await request(app).get('/companies');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      companies: [
        {
          code: 'apple',
          name: 'Apple'
        },
        {
          code: 'ibm',
          name: 'IBM'
        },
      ],
    });
  });
});

// Test get /companies/:code route
describe('GET /:code', function () {
  it('should get one company', async function () {
    const response = await request(app).get('/companies/apple');
    expect(response.statusCode).toBe(200);
    // Add your specific expectations here based on the response structure
  });

  it('should return 404 for a non-existent company', async function () {
    const response = await request(app).get('/companies/nonexistent');
    expect(response.statusCode).toBe(404);
  });
});

// Test post /companies/:code route
describe('POST /', function () {
  it('should create a company', async function () {
    const response = await request(app)
      .post('/')
      .send({name: 'Disney', description: 'Pixar, Disney and LucasFilms.', industry_id:'tech' });
    expect(response.body).toEqual({
      companies: [
        {
          code: 'disney',
          name: 'Disney',
          description: 'Pixar, Disney and LucasFilms.',
          industry_id:['tech']
        },
      ],
    });
  });

  it('should return 500 for conflict', async function () {
    const response = await request(app).post('/companies').send({ code: 'disney', description: 'Greeting' });
    expect(response.statusCode).toBe(500);
  });
});
