/** BizTime express application. */


const express = require("express");
const ExpressError = require("./expressError");
const companyRoutes = require("./routes/companies");
const invoicesRoutes = require('./routes/invoices');
const industryRoutes = require('./routes/industries')


const app = express();

// Parse request bodies for JSON
app.use(express.json());



app.use('/companies', companyRoutes);
console.log('Company routes mounted');

app.use('/invoices', invoicesRoutes)
console.log('Invoice route mounted')

app.use('/industries', industryRoutes)
console.log('industry route mounted')





// /** 404 handler */

app.use(function(req, res, next) {

  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;

