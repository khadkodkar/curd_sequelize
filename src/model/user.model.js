var Sequelize = require('sequelize');
var DataTypes = Sequelize;
module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("user", {    
    name: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
    });    
    return user;
};
    