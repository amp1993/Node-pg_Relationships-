
const express = require('express');
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

        const results = await db.query(
            'SELECT code, name, description, invoices FROM companies WHERE code = $1',[req.params.code]);

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
//Add a new company
router.post('/', async function(req,res, next){
    try{

        console.log('Request reached companies post route');
        let { code, name, description } = req.body;


        const results = await db.query(
            'INSERT INTO companies (code, name, description) VALUES ($1,$2,$3) RETURNING code, name, description',[code, name, description]);
        
        return res.json({companies:results.rows});

    } catch (e){
        return next(e)
    }
})

router.post('/', async function(req,res, next){
    try{

        console.log('Request reached companies post route');
        let { code, name, description } = req.body;


        const results = await db.query(
            'INSERT INTO companies (code, name, description) VALUES ($1,$2,$3) RETURNING code, name, description',[code, name, description]);
        
        return res.json({companies:results.rows});

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