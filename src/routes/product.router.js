
const {Product} = require('../models/Models');
const { validatedToken } = require('../utilities/auth');


const router = require('express').Router();


// list all products
router.get('/',validatedToken ,async (request,response)=>{
    try {
        const products = await Product.findAll();
        if (products.length > 0) {
            response.status(200).json({status:200,products});
        } else {
            console.log(products.length);
            response.status(200).json({status:204,message:'No records'});
        }
        
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
});


//list one product
router.get('/:id', validatedToken,async (request,response)=>{
    try {
        const {id} = request.params;
        const product = await Product.findByPk(id);
        response.status(200).json({status:200,product});
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
    
});

//create product
router.post('/store',validatedToken, async (request,response)=>{
    try {
        const {lot,name,price,quantity,entry_date} = request.body;
        const product = await Product.create({lot,name,price,quantity,entry_date});
        response.status(201).json({status:201,message:'Created product',product});
        
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
});

// update product
router.put('/update/:id', validatedToken ,async (request,response)=>{
    try {
        const {id} = request.params
        const {lot,name,price,quantity,entry_date} = request.body;
        const product = await Product.update({ lot,name,price,quantity,entry_date},{
            where:{
                id
            }
        }
        );
        response.status(200).json({status:200,product});
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
});

// delete product
router.delete('/destroy/:id',validatedToken, async(request,response)=>{
    try {
        const {id} = request.params
        const product = await Product.destroy({where:{
            id
        }})
        
        response.status(200).json({status:200,message:'product successfully removed'});
        
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
   
});
module.exports = router;