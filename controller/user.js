const errorHandler = require("../utils/error_handler");
const Users = require("../model/users");

const profile = errorHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await Users.findById(userId).populate('subscription');
    if(!user){
        return res.status(400).json({
            message: "User Not Found"
        })
    }
    user.password = undefined;
    const info = {
        name: user.name,
        email: user.email,
        image: user.image,
        subscriptionPlan: user.subscription.plan,
        productLimit: user.subscription.productLimit,
        isActive: user.subscription.isActive
    }
    res.status(200).json({
        info
    })
});

const editProfile = errorHandler(async (req, res) => {
    const userId = req.user.id;
    const { name } = req.body;
const user = await Users.findById(userId);
    // const updated = await Users.findByIdAndUpdate(userId, {name}, {
    //     new: true ,
    // });
     user.name = name;
        const updatedUser = await user.save();
    res.status(200).json(
        updatedUser
    )
})
const usersProfie = errorHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await Users.findById(userId).select('-password') 
    .populate('productsPosted');
    
    res.status(200).json({user});
})
module.exports = {
          profile,
          editProfile,
          usersProfie
}