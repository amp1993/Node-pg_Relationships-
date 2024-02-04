
const express = require('express');
const slugify=require('slugify');
const router = new express.Router();

const db = require("../db"); 
const ExpressError = require("../expressError")


//Get all companis
router.get('/', async function(req,res, next){
    try{
        console.log('Request reached /companies route');

        const results = await db.query(
            `SELECT code, name FROM companies`
        );
        return res.json({companies:results.rows});
    } catch (e){
        return next(e)
    }
})

//Get a company that matches the code
router.get('/:code', async function(req,res, next){
    try{
        console.log('Request reached /companies/:code route');

        const companyResults = await db.query(
            'SELECT c.code, c.name, c.description, c.industry_id, i.industry FROM companies AS c JOIN industries AS i ON c.industry_id = i.code WHERE c.code = $1',[req.params.code]);

        const invoiceResults = await db.query('SELECT id FROM invoices WHERE comp_code = $1',[req.params.code])

        if (companyResults.rows.length === 0){
            let notFoundError = new ExpressError('Company Not Found', 404)
            throw notFoundError

        } else {let company = companyResults.rows[0];
            let invoices = invoiceResults.rows;
    
            company.invoices = invoices.map(inv => inv.id);
            return res.json({'companies': company})}
        
    } catch (e){
        return next(e)
    }
})
//Add a new company
router.post('/', async function(req,res, next){
    try{

        console.log('Request reached companies post route');
        let { name, description, industry_id } = req.body;
        let code = slugify(name,{lower: true})

        const results = await db.query(
            'INSERT INTO companies (code, name, description, industry_id) VALUES ($1,$2,$3,$4) RETURNING code, name, description, industry_id',[code, name, description, industry_id]);
        
        
        return res.json({'companies':results.rows[0]});

    } catch (e){
        return next(e)
    }
})



router.put('/:code', async function(req,res, next){
    try{

        console.log('Request reached companies put route');
        let { name, description } = req.body;


        const results = await db.query(
            'UPDATE companies SET name=$2, description=$3 WHERE code=$1 RETURNING code, name, description',[req.params.code, name, description]);
        
        if (results.rows.length !== 0){
            return res.json({'companies':results.rows});

        } else {
            let notFoundError = new ExpressError('Company Not Found', 404)
            throw notFoundError
        }

    } catch (e){
        return next(e)
    }
})


router.delete('/:code', async function(req,res, next){
    try{

        console.log('Request reached companies delete route');

        const results = await db.query(
            'DELETE FROM companies WHERE code=$1 RETURNING code',[req.params.code]);
        
        if (results.rows.length !== 0){
            return res.json({status:'deleted'});

        } else {
            let notFoundError = new ExpressError('Company Not Found', 404)
            throw notFoundError
        }

    } catch (e){
        return next(e)
    }
})

module.exports = router;

