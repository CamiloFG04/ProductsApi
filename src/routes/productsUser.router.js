const {ProductsUsers, Product, User} =  require('../models/Models');
const fs = require('fs');
const db = require('../db/database');
const { QueryTypes } = require('sequelize');
const router = require('express').Router();
const moment = require('moment');
const { validatedToken } = require('../utilities/auth');


// list all products
router.get('/', validatedToken, async (request,response)=>{
    try {
        const products = await ProductsUsers.findAll();
        if (products.length > 0) {
            response.status(200).json({status:200,products});
        } else {
            console.log(products.length);
            response.status(200).json({status:204,message:'No records'});
        }
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
    
    // try {
    //     const productsUsers = await ProductsUsers.findAll({
    //       include: [
    //         {
    //           model: Product,
    //           as: 'products',
    //         },
    //         {
    //           model: User,
    //           as: 'users',
    //         },
    //       ],
    //     });
    
    //     if (productsUsers.length > 0) {
    //       response.status(200).json({ status: 200, productsUsers });
    //     } else {
    //       response.status(204).json({ status: 204, message: 'No records' });
    //     }
    //   } catch (error) {
    //     console.error('Error al obtener los productos y usuarios:', error);
    //     response.status(500).json({ status: 500, message: 'Error interno del servidor' });
    //   }
    
});


//list products of one user
router.get('/user/:id', validatedToken, async (request,response)=>{
    try {
        const {id} = request.params;
        const product = await ProductsUsers.findOne({
            where:{
                user_id:id,
            },
        });
        response.status(200).json(product);
        
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
});

//create product
router.post('/store', validatedToken, async (request,response)=>{
    try { 
        const {user_id,product_id,quantity} = request.body;
        const product = await Product.findByPk(product_id);
        if (product != null) {
            if (product.quantity > 0 && product.quantity >= quantity && quantity > 0) {
                const total = product.price * quantity;
                const newQuantity = product.quantity - quantity;
                const productsUser = await ProductsUsers.create(
                {
                    user_id,
                    product_id,
                    quantity,
                    total
                },
                );
                product.update({quantity:newQuantity},{where:{id:product_id}});
                response.status(201).json({status:201,message:'products added to user',productsUser});
            }else if(quantity < 0){
                response.status(200).json({status:200,message:'Add a valid quantity'});
            }else{
                response.status(200).json({status:200,message:'Not stock avalible'});
            }
        }else{
            response.status(200).json({status:200,message:'Product does not exist'});
        }
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
    
});

router.get('/printBill/:id', validatedToken, async (request,response)=>{
    try {
        const {id} = request.params;
          const query = `SELECT pu.quantity,pu.total,pu.createdAt,p.name as productName,u.name,u.lastname FROM product_users as pu JOIN products as p on pu.product_id = p.id JOIN users as u on pu.user_id = u.id WHERE pu.id = ${id}`;
          const results = await db.query(query, { type: QueryTypes.SELECT });
      
          // Formatea los resultados como un archivo plano, por ejemplo, en formato CSV
          const csvData = results.map((row) => {
              const date = moment(row.createdAt).format('MM-DD-YYYY');
            return `${row.name},${row.lastname},${row.productName},${row.quantity},${row.total},${date}`;
          }).join('\n');
      
          // Nombre del archivo y tipo de contenido para la respuesta
          const fileName = 'datos.csv';
          response.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
          response.setHeader('Content-Type', 'text/csv');
      
          // Envía el archivo al navegador del usuario
          response.send(csvData);
    } catch (error) {
        response.json({status:500,message:'Internal Server Error'})
    }
});




module.exports = router;