require ('dotenv').config()
const app = require('./src/app')
const connectDB=require("./src/DataBase/db.js")





app.listen(3000, () => {
    console.log('server is up on port 3000');
connectDB()
})