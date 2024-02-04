const db = require('./db');

async function createData() {
    await db.query('DROP TABLE IF EXISTS industry_tag');
    await db.query('DROP TABLE IF EXISTS invoices');
    await db.query('DROP TABLE IF EXISTS companies');
    await db.query('DROP TABLE IF EXISTS industries');

    await db.query(`
        CREATE TABLE IF NOT EXISTS industries (
            code text PRIMARY KEY,
            industry text NOT NULL
        )`);

    await db.query(`
        CREATE TABLE IF NOT EXISTS companies (
            code text PRIMARY KEY,
            name text NOT NULL UNIQUE,
            description text,
            industry_id text NOT NULL REFERENCES industries(code) ON DELETE CASCADE
        )`);

    await db.query(`
        CREATE TABLE IF NOT EXISTS invoices (
            id serial PRIMARY KEY,
            comp_code text NOT NULL REFERENCES companies(code) ON DELETE CASCADE,
            amt float NOT NULL,
            paid boolean DEFAULT false NOT NULL,
            add_date date DEFAULT CURRENT_DATE NOT NULL,
            paid_date date,
            CONSTRAINT invoices_amt_check CHECK (amt > 0)
        )`);

    await db.query(`
        CREATE TABLE IF NOT EXISTS industry_tag (
            id serial PRIMARY KEY,
            industry_id text NOT NULL REFERENCES industries(code) ON DELETE CASCADE,
            comp_code text NOT NULL REFERENCES companies(code) ON DELETE CASCADE
        )`);

    await db.query(`
        INSERT INTO industries (code, industry)
        VALUES ('tech', 'Tech Company'),
               ('social_media', 'Social Media')`);

    await db.query(`
        INSERT INTO companies (code, name, description, industry_id)
        VALUES ('apple', 'Apple', 'Maker of OSX.','tech'),
               ('ibm', 'IBM', 'Big blue.','tech')`);

    await db.query(`
        INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
        VALUES ('apple', 100, false, '2018-01-01', null),
               ('apple', 200, true, '2018-02-01', '2018-02-02'),
               ('ibm', 300, false, '2018-03-01', null)
        RETURNING id`);

    await db.query(`
        INSERT INTO industry_tag (industry_id, comp_code)
        VALUES ('tech', 'apple'),
               ('tech', 'ibm')`);
}

module.exports = { createData };
