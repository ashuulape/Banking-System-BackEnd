const mongoose= require("mongoose")

const connectDB=()=>{

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('DataBase Connected Sucessfully'))
.catch(err=>{
    console.log('DataBase Not Connected',err.message);
    process.exit(1)})


}

module.exports=connectDB;


