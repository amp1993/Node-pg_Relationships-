
const express = require('express');
const router = new express.Router();
const db = require("../db"); 
const ExpressError = require("../expressError")


//Get all invoices
router.get('/', async function(req,res, next){
    try{
        console.log('Request reached /invoices route');

        const results = await db.query(
            `SELECT id, comp_code FROM invoices`
        );
        return res.json({invoices:results.rows});
    } catch (e){
        return next(e)
    }
})

//Get an invoice that matches the code
router.get('/:id', async function(req,res, next){
    try{
        console.log('Request reached /invoices/:id route');

        const results = await db.query(
            'SELECT i.id, i.comp_code, i.amt,i.paid, i.add_date, i.paid_date, c.name, c.description FROM invoices AS i JOIN companies AS c ON i.comp_code = c.code WHERE i.id = $1',[req.params.id]);
        
        if (results.rows.length !== 0){
            return res.json({'invoice': results.rows} );

        } else {
            let notFoundError = new ExpressError('Invoice Not Found', 404)
            throw notFoundError
        }
    } catch (e){
        return next(e)
    }
})
//Add a new invoice. Needs to be passed in JSON body of: {comp_code, amt}, 
//Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
router.post('/', async function(req,res, next){
    try{
        let { comp_code, amt } = req.body;

        const results = await db.query(
            'INSERT INTO invoices (comp_code, amt) VALUES ($1,$2) RETURNING id,comp_code, amt, paid, add_date, paid_date',[comp_code, amt]);
        
        return res.json({'invoices':results.rows});

    } catch (e){
        return next(e)
    }
})
//PUT /invoices/[id] : Updates an invoice. If invoice cannot be found, returns a 404.
//Needs to be passed in a JSON body of {amt} Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}


router.put('/:id', async function(req,res, next){
    try{

        let { comp_code,amt,paid,add_date,paid_date} = req.body;


        const results = await db.query(
            'UPDATE invoices SET comp_code=$2, amt=$3, paid=$4,add_date=$5,paid_date=$6 WHERE id=$1 RETURNING id,comp_code,amt,paid,add_date,paid_date',[req.params.id,comp_code,amt,paid,add_date,paid_date]);
        
        if (results.rows.length !== 0){
            return res.json({'companies':results.rows});

        } else {
            let notFoundError = new ExpressError('Invoice Was Not Found', 404)
            throw notFoundError
        }

    } catch (e){
        return next(e)
    }
})

// DELETE /invoices/[id] : Deletes an invoice.If invoice cannot be found, returns a 404. Returns: {status: "deleted"} Also, one route from the previous part should be updated:


router.delete('/:id', async function(req,res, next){
    try{

        const results = await db.query(
            'DELETE FROM invoices WHERE id=$1 RETURNING id',[req.params.id]);
        
        if (results.rows.length !== 0){
            return res.json({status:'deleted'});

        } else {
            let notFoundError = new ExpressError('Invoice Was Not Found', 404)
            throw notFoundError
        }

    } catch (e){
        return next(e)
    }
})

module.exports = router;