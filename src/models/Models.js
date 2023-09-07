const { DataTypes } = require("sequelize");
const db = require("../db/database");

const User = db.define('users',{
    name:{
        type:DataTypes.STRING,
        allowNull: true
    },
    lastname:{
        type:DataTypes.STRING,
        allowNull: true
    },
    document:{
        type:DataTypes.INTEGER,
        allowNull: true
    },
    email:{
        type:DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    password:{
        type:DataTypes.STRING,
        allowNull: true,
        // validate: {
        //     is: /^[0-9a-f]{64}$/i
        // }
    },
    rol:{
        type:DataTypes.INTEGER
    }
});
const Product = db.define('products',{
    lot:{
        type:DataTypes.STRING,
        allowNull: true
    },
    name:{
        type:DataTypes.STRING,
        allowNull: true
    },
    price:{
        type:DataTypes.FLOAT(10.2),
        allowNull: true
    },
    quantity:{
        type:DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    entry_date:{
        type:DataTypes.DATE,
        allowNull: true,
    },
});

const ProductsUsers = db.define('product_users',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
});


Product.belongsToMany(User, {
    through: 'product_users',
    as: 'users',
    foreignKey: 'product_id',
  });
  
  User.belongsToMany(Product, {
    through: 'product_users',
    as: 'products',
    foreignKey: 'user_id',
  });

module.exports = {User,Product,ProductsUsers};