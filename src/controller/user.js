const db = require("../model");
const User = db.user;
const Op = db.Sequelize.Op;
const { issueJWT } = require("../lib/jwt");

//-------------------- addUser --------------------
module.exports.addUser = async( req , res ) => {
    try {
        let {name,city,gender,password}=req.body;
        let user={
            name     : name.toLowerCase(),
            city     : city.toLowerCase(),
            gender   : gender.toLowerCase(),
            password : password
        }
        let userCreate = await User.create(user)
        res.status(200).json({
            success : true,
            message : "user add successfully",
        })
    }catch(err){
        res.status(400).json({
            success : false,
            message : err.TypeError
        })
    }   
};

//-------------------- logIn --------------------
module.exports.login = async( req , res ) => {
    try {
        let {name,password} = req.body;
        let userCreate = await User.findAll({ where:{[Op.and]:[{name:name},{password:password}] }});
        if(userCreate.length>0){
            let token = await issueJWT(userCreate[0].dataValues)
            res.status(200).json({
                success : true,
                message : "user login successfully",
                token   : token
            })
        }else{
            res.status(404).json({
                success : false,
                message : "user not match",
                token   : token
            })    
        }
    }catch(err){
        res.status(400).json({
            success : false,
            message : err.TypeError
        })
    }   
};

//-------------------- editUser --------------------
module.exports.editUser = async ( req , res ) => {
    try{
        let {id}=req.body;
        let userfindOne =await User.findAll({where: { id: id }})
        if(userfindOne.length>0){
            let userUpdate =await User.update(req.body, {
                where: { id: id }
            })
            if(userUpdate[0]==1){
                res.status(200).json({
                    success : true,
                    message : "User data updated successfully"
                })   
            }else{
                res.status(404).json({
                    success : false,
                    message : "Something went wrong"
                })
            }
        }else{
            res.status(404).json({
                success : false,
                message : "User id not found"
            })
        }
    }catch(err){
        res.status(400).json({
            success : false,
            message : err
        })
    }   
};

//-------------------- deleteUser --------------------
module.exports.deleteUser = async ( req , res ) => {
    try {
        let {id}=req.body;
        let userfindOne =await User.findAll({where: { id: id }})
        if(userfindOne.length>0){
            let userDelete =await User.destroy({ where: { id: id }})
            if(userDelete==1){
                res.status(200).json({
                    success : true,
                    message : "User data delete successfully"
                })   
            }else{
                res.status(404).json({
                    success : false,
                    message : "Something went wrong"
                })
            }
        }else{
            res.status(404).json({
                success : false,
                message : "User id not found"
            })
        }
    }catch(err){
        res.status(400).json({
            success : false,
            message : err
        })
    }   
};

//-------------------- showUserList --------------------
module.exports.showUserList = async ( req , res ) => {
    try {
        let userList =await User.findAll();
        res.status(200).json({
            success : true,
            message : "User list data",
            data    : userList
        })
    }catch(err){
        res.status(400).json({
            success : false,
            message : err
        })
    }        
};

//-------------------- filterUserList --------------------
module.exports.filterUserList = async ( req , res )=> {
    try { 
        let {name,city,gender,condition, pageNumbeP , PageSize}=req.body;
        let pageNumber = req.body.PageNumber || 1;
        let pageSize = req.body.PageSize || 10;
        let Offset = 0 + (pageNumber - 1) * pageSize;
        let cases;
        let whereName="";
        let whereCity="";
        let whereGender="";
        if(condition==""){
           if(name!=''||city!=''||gender!=''){            
                if(name!=''){
                    whereName = { name: { [Op.like]: '%' + name + '%' } }
                }
                if (city!=''){
                    whereCity = { city: { [Op.like]: '%' + city + '%' } }
                }   
                if (gender!=''){
                    whereGender = { gender: gender }
                }   
                cases={where:{[Op.or]:[whereGender , whereCity, whereName]}};
            }
        } else{  
        if(name!=''){
            whereName = { name: { [Op.like]: '%' + name + '%' } }
        }
         if (city!=''){
            whereCity = { city: { [Op.like]: '%' + city + '%' } }
        }   
         if (gender!=''){
            whereGender = { gender: gender }
        }   

        if(condition=='and'){
            cases={where:{[Op.and]:[whereGender , whereCity, whereName]}};
        }
        if(condition=='or'){
            cases={where:{[Op.or]:[whereGender,whereCity,whereName]}};
        }
    }
        let userFilterData
        if(cases==undefined){
            userFilterData =await User.findAll({
                limit: pageNumber*pageSize,
                offset:Offset,
            });
        }else{            
            cases.limit=pageNumber*pageSize;
            cases.offset=Offset;
            userFilterData =await User.findAll(cases);
        }
        res.status(200).json({
            success : true,
            message : "User filter data list",
            data    : userFilterData
        })
    }catch(err){
        res.status(400).json({
            success : false,
            message : err
        })
    }        
};