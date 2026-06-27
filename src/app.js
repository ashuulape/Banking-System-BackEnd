const express=require('express')
const cookieparser=require('cookie-parser')
const authroutes = require('./routes/auth.routes')
const accountrouter= require('./routes/account.routes')
const transactionRoutes=require('./routes/transaction.router')

const app=express()
app.use(express.json())
app.use(cookieparser())

app.get('/',(req,res)=>{
  res.send('server is working')
})
app.use('/api/auth',authroutes)
app.use('/api/accounts',accountrouter)
app.use('/api/transaction',transactionRoutes)





module.exports=app