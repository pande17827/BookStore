const router=require('express').Router();
const Order=require('../models/order');
const {authenticateToken}=require('./userAuth')
const Book=require('../models/book')
const User=require('../models/user')

router.post('/place_order',authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers
        const {order}=req.body

        for(const orderData of order){
            const newOrder=new Order({
                user:id,
                book:orderData._id
            })
            const orderDataFromDB=await newOrder.save()

            // saving order in user model
            await User.findByIdAndUpdate(id,{$push:{orders:orderDataFromDB._id}})

            // clearing cart
            await User.findByIdAndUpdate(id,{$pull:{cart:orderData._id}})
        }

        return res
        .status(200)
        .json({
            status:"success",
            message:"Order placed successfully"})

    }catch(error){
        return res
        .status(500)
        .json({message:"error occured while placing order"})
    }
})


// get all orders
router.get('/get_all_orders',authenticateToken,async(req,res)=>{
    try{
        const userData=await Order.find()
            .populate({
                path:"book",

            })
            .populate({
                path:"user",
            })
            .sort({createdAt:-1})
        return res
        .status(200)
        .json({
            status:"success",
            data:userData
        })
    }
    catch(error){
        return res
        .status(500)
        .json({message:"error occur while fetching orders"})
    }
})

// updating order -- only for admin
router.put('/update_order_status',authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers
        await Order.findByIdAndUpdate(id,{status:req.body.status})

        return res
        .status(200)
        .json({
            status:"success",
            message:"Order status updated successfully"
        })
    }
    catch(error){
        return res
        .status(500)
        .json({message:"error occur while fetching orders"})
    }
})







module.exports=router