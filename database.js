const mongoose=require('mongoose');

class DataBase{
    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect('mongodb+srv://DataBaseUser:dbUserPassword@twitterclonecluster.5bocpkx.mongodb.net/?retryWrites=true&w=majority&appName=twitterclonecluster')
        .then(()=>{
            console.log("Database Connection successful");
        })
        .catch((err)=>{
            console.log("Database Connection failed",err);
        })
    }
}

module.exports = new DataBase;