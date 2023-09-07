const {User} = require('../models/Models');
const { generateAccessToken, validatedToken } = require('../utilities/auth');
// require('dotenv').config();
const router = require('express').Router();

//auth user
router.post('/auth',async (request,response)=>{
    try {
        const {email,password} = request.body;
        const user = User.findOne(
            {where:{
                email,
                password,
            },
        });
        if (user != null) {
            const accesstoken = generateAccessToken(email);
            response.header('authorization',accesstoken).status(200).json({status:200,message:'authenticated user',token:accesstoken});
        }
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
    
});


//list users
router.get('/',validatedToken, async (request,response)=>{
    try {
        const users = await User.findAll();
        response.status(200).json({status:200,username: request.user,users});
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
    
});

//list one user
router.get('/:id',validatedToken, async (request,response)=>{
    try {
        const {id} = request.params
        const user = await User.findByPk(id);
        response.status(200).json({status:200,user});
        
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
});

//create user
router.post('/store',async (request,response)=>{
    try {
        const {name,lastname,document,email,password} = request.body;
        const user = await User.create({name,lastname,document,email,password});
        response.status(201).json({status:201,message:'Created user',user});
        
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
});
module.exports = router;