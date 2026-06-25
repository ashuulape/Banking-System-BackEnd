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

const getAllAccountsController = async (req, res) => {
    try {
        const accounts = await accountModel.find();
        res.status(200).json({ accounts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching accounts", error: error.message });
    }
};




module.exports = {createAccountController,getAllAccountsController};