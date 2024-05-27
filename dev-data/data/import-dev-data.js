const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
// //It is the kind of file where we do all of the setup of our application

dotenv.config({path: './config.env'});

//replacing this placeholder string PASSWORD with the real password
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
// const port = 3000;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => {
    console.log('DB Connection Successful!');
    // const port = process.env.PORT || 3000;
    // app.listen(port, () => {
    //     console.log(`App running on port ${port}...`)
    // });
})
// .catch((err) => {
//     console.error('Error connecting to DB:', err);
// });

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//IMPORT DATA INTO DB
const importData = async () => {
    try{
        await Tour.create(tours);//It will create a separate document for each of the objects from array
        console.log('Data Successfully loaded');
    }catch(err){
        console.log(err);
    }
    process.exit();
};

//DELETE ALL DATA FROM DB
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('Data Successfully deleted');
    }catch(err){
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}