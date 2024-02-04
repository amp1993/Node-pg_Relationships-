const express = require('express');
const router = new express.Router();
const db = require("../db"); 
const ExpressError = require("../expressError");
const slugify  = require('slugify');


//List all industries, which should show the company code(s) for that industry. 
//Include industry code, industry name, company codes (should be an array)
router.get('/', async function(req, res, next) {
    try {
        const industriesResults = await db.query('SELECT t.industry_id, i.industry FROM industry_tag AS t JOIN industries AS i ON t.industry_id = i.code');
        const companyResults = await db.query('SELECT t.comp_code, c.name FROM industry_tag AS t JOIN companies AS c ON t.comp_code = c.code');

        if (industriesResults.rows.length === 0) {
            throw new ExpressError('Please Add An Industry', 204);
        } else {
            let industries = industriesResults.rows;
            let companies = companyResults.rows;

            industries.forEach(industry => {
                industry.companies = companies
                    .map(company => company.name);
            });

            return res.json({ 'industries': industries });
        }
    } catch (err) {
        next(err);
    }
});

//Get information on one industry 
router.get('/:code', async function(req, res, next) {
    try {
        const industriesResults = await db.query('SELECT i.code, i.industry, t.comp_code FROM industries AS i LEFT JOIN industry_tag AS t ON i.code = t.industry_id WHERE i.code=$1', [req.params.code]);
        const industry = industriesResults.rows[0];

        if (!industry) {
            throw new ExpressError('Industry Not Found', 404);
        }

        const companyResults = await db.query('SELECT t.comp_code, c.name FROM industry_tag AS t JOIN companies AS c ON t.comp_code = c.code WHERE t.industry_id = $1', [industry.code]);

        let companies = companyResults.rows;

        industry.companies = companies.map(company => company.name);

        return res.json({ 'industry': industry });
    } catch (err) {
        next(err);
    }
});

//Add a new industry

router.post('/', async function(req,res,next){
    try{
        let {industry} = req.body;
        let code = slugify(industry,{lower:true})
        let results = await db.query('INSERT INTO industries (code, industry) VALUES ($1,$2) RETURNING code, industry',[code,industry]);
        return res.json({'industry':results.rows})
    } catch(err){
        next(err)
    }
})

//Deleting an indsutry

router.delete('/:code', async function(req, res, next){
   try{ let results = await db.query('DELETE FROM industries WHERE code =$1',[req.params.code])
   return res.json({'industries':results.rows[0]})
} catch(err){
    next(err)
}});

//associating an industry to a company

module.exports = router;