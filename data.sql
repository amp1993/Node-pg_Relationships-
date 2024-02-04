\c biztime


DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS industry_tag;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;

CREATE TABLE industries (
  code text PRIMARY KEY,
  industry text NOT NULL
);

CREATE TABLE companies (
  code text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  industry_id text NOT NULL REFERENCES industries(code) ON DELETE CASCADE
);

CREATE TABLE invoices (
  id serial PRIMARY KEY,
  comp_code text NOT NULL REFERENCES companies(code) ON DELETE CASCADE,
  amt float NOT NULL,
  paid boolean DEFAULT false NOT NULL,
  add_date date DEFAULT CURRENT_DATE NOT NULL,
  paid_date date,
  CONSTRAINT invoices_amt_check CHECK ((amt > 0)::double precision)
);

CREATE TABLE industry_tag (
  id serial PRIMARY KEY,
  industry_id text NOT NULL REFERENCES industries(code) ON DELETE CASCADE,
  comp_code text NOT NULL REFERENCES companies(code) ON DELETE CASCADE
);

INSERT INTO industries (code, industry)
VALUES ('tech', 'Tech Company'),
       ('social_media', 'Social Media');

INSERT INTO companies (code, name, description, industry_id)
VALUES ('apple', 'Apple Computer', 'Maker of OSX.', 'tech'),
       ('ibm', 'IBM', 'Big blue.', 'tech');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
VALUES ('apple', 100, false, null),
       ('apple', 200, false, null),
       ('apple', 300, true, '2018-01-01'),
       ('ibm', 400, false, null);

INSERT INTO industry_tag (industry_id, comp_code)
VALUES ('tech', 'apple'),
       ('tech', 'ibm');
