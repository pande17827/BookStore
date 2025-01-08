const router=require('express').Router();
const User=require('../models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {authenticateToken}=require('./userAuth');

router.post('/sign_up',async(req,res)=>{
    try{
        const {username,email,password,address}=req.body;

        // check username length is more than 4
        if(username.length<4){
            return res
            .status(400)
            .json({message:"username length should be more than 4"})
        }

        // check username already exist

        const existingUsername=await User.findOne({username:username})
        if(existingUsername){
            return res
            .status(400).json({message:"username already exist"})
        }  

        // check email already exist
        const existingEmail=await User.findOne({email:email})
        if(existingEmail){
            return res
            .status(400).json({message:"email already exist"})
        }
        
        // check password length is more than 5
        if(password.length<5){
            return res
            .status(400)
            .json({message:"password length should be more than 5"})
        }


        // hashing the password
        const hashPassword=await bcrypt.hash(password,10);
        // creating new user
        const newUser=new User({
            username:username,
            email:email,
            password:hashPassword,
            address:address
        });

        await newUser.save();
        res.status(200).json({message:"user created successfully"})

    }catch(error){
        res.status(500).json({message:"Internal server error"})
    }
})


router.post('/sign_in', async (req, resp) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return resp
                .status(400)
                .json({ message: "User does not exist or invalid credentials" });
        }

        // Compare passwords using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (isPasswordMatch) {
            const authClaims=[
                {name:existingUser.username},
                {role:existingUser.role}] 
            const token=jwt.sign({authClaims},"bookStore123",{expiresIn:"30d"});
            return resp.status(200).json({ id:existingUser._id,role:existingUser.role,token:token });
        } else {
            return resp.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error); // Log error for debugging
        return resp.status(500).json({ message: "Internal server error" });
    }
});


//get user information
router.get('/get_user_information',authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers
        const data=await User.findById(id).select("-password");
        res.status(200).json(data)

    }catch(error){
        res
        .status(500)
        .json({message:"Internal server error"})
    }
})

// udpate the address
router.put('/update_address',authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers
        const {address}=req.body
        const data=await User.findByIdAndUpdate(id,{address:address})
        res.status(200).json({message:"address updated successfully"})
    }catch(error){
        res
        .status(500)
        .json({message:"Internal server error"})
    }
})


module.exports=router