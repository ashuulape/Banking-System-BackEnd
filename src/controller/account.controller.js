const accountModel=require('../Models/account.model')


const createAccountController = async (req, res) => {

    const user=req.user
  
    const Account= await accountModel.create({
        user:user._id
    })

    res.status(200).json({
        Account
    })
};



module.exports = {createAccountController};