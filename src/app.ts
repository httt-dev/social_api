import express from 'express';
import { Route } from './core/interfaces';
import mongoose from 'mongoose';

class App{
    public app : express.Application;
    public port : string|number;

    constructor(routes : Route[]){
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.initializeRoutes(routes);
        this.connectToDatabase();
    }
    private initializeRoutes(routes : Route[]){
        routes.forEach((route) => {
            this.app.use('/' , route.router);
        })
    }

    public listen(){
        this.app.listen(this.port , ()=>{
            console.log(`Server is listening on port ${this.port}`); 
        })
    }

    private async connectToDatabase(){
        try{
            const connectionString  = "mongodb+srv://social:Abc12345@master.dlu4d.mongodb.net/social?retryWrites=true&w=majority";
            await mongoose.connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
              });
              console.log("Connect DB successful")
        }
        catch(error){
            console.log("Connect DB error")
        }
    }
}

export default App;