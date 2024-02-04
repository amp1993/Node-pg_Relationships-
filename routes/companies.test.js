
//Connect to testing enviroment
process.env.NODE_ENV = "test";

//Require needed library
const request = require('supertest')
//Connect to app
const app = require('../app');
//Connect to datababse
const db = require('../db');
const { createData } = require('../_test-common');


beforeEach(createData);

afterAll(async function () {
    await db.end()
});

//Test get all companies
describe('GET /', function () {

    it('Get list of all companies', async function () {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            {
                'companies':
                    [{
                        code: 'apple',
                        name: 'Apple'

                    },
                    {
                        code: 'ibm',
                        name: 'IBM'
                    }]
            }
        )
    })
});

//Test get /companies/:code route

describe('GET /:code', function () {

    it('Get one company', async function () {
        const response = await request(app).get('/companies/apple');
        expect(response.statusCode).toBe(200);
        // expect(response.body).toEqual(
        //     {'companies':
        //     {
        //         code:'apple',
        //         name: 'Apple',
        //         description: 'Maker of OSX.',
        //         invoices: '[1,2]',

        //     }}
        // )
    })
});

//Test post /companies/:code route



describe('POST /', function () {

    it('Create a company', async function () {
        const response = await request(app)
            .post('/companies')
            .send({ code: 'disney', name: 'Disney', description: 'Pixar, Disney and LucasFilms.' });
        expect(response.body).toEqual(
            {
                'companies':
                 [   {
                        code: 'disney',
                        name: 'Disney',
                        description: 'Pixar, Disney and LucasFilms.',

                    }]
            })
    })
    it('It should return 500 for conflict', async function () {
        const response = await request(app).post('/companies').send({ code: 'disney', description: 'Greeting' });
        expect(response.statusCode).toBe(500);
    })

});
//Test delete /companies/:code route