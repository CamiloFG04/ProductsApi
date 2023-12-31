const {User} = require('../models/Models');
const { generateAccessToken, validatedToken, checkRoleAuth} = require('../utilities/auth');
// require('dotenv').config();
const router = require('express').Router();

//auth user
router.post('/auth',async (request,response)=>{
    try {
        const {email,password} = request.body;
        const login = await User.findOne(
            {where:{
                email,
                password,
            },
        });
        if (login != null) {
            const  user = {email,role:login.rol}
            const accesstoken = generateAccessToken(user);
            response.header('authorization',accesstoken).status(200).json({status:200,message:'authenticated user',token:accesstoken});
        }
    } catch (error) {
        console.log(error);
        response.json({status:500,message:'Internal Server Error'})
    }
    
});


//list users
router.get('/',validatedToken(['Administrator']), async (request,response)=>{
    try {
        const users = await User.findAll();
        response.status(200).json({status:200,username: request.user,users});
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
    
});

//list one user
router.get('/:id',validatedToken(['Administrator']), async (request,response)=>{
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
        const {name,lastname,document,email,password,rol} = request.body;
        const user = await User.create({name,lastname,document,email,password,rol});
        response.status(201).json({status:201,message:'Created user',user});
        
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
});
module.exports = router;