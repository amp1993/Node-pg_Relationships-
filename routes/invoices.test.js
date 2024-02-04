const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { createData } = require('../_test-common');

beforeEach(createData);

afterAll(async () => {
  await db.end();
});

// Test GET /invoices route
describe('GET /', () => {
  it('should get list of all invoices', async () => {
    const response = await request(app).get('/invoices');

    expect(response.statusCode).toBe(200);
    });
});

// Test GET /invoices/:id route
describe('GET /:id', () => {
    it('should get information on one invoice', async function() {
      const response = await request(app).get('/invoices/1');
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        invoice: [
          {
            id: 1,
            comp_code: 'apple',
            amt: 100,
            paid: false,
            name: 'Apple',
            add_date: '2018-01-01T05:00:00.000Z',
            paid_date: null,
          },
        ],
      });
    })});
  
    it('should return 404 status if invoice is not found', async function() {
      const response = await request(app).get('/invoices/999');
  
      expect(response.statusCode).toBe(404);
 
      });
   