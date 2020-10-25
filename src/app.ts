import express from 'express';
import { Route } from '@core/interfaces';
import mongoose from 'mongoose';
import hpp from 'hpp';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { Logger } from '@core/utils';
import { errorMiddleware } from '@core/middleware';


class App{
    public app : express.Application;
    public port : string|number;

    public production : boolean;

    constructor(routes : Route[]){
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.production = process.env.NODE_ENV == 'production' ? true : false;
        //connect to db
        this.connectToDatabase();
        //declare middleware 
        this.initializeMiddlewares();
        //init route must be bellow other config
        this.initializeRoutes(routes);
        //call custome error middleware at the last (fix bug return invalid json )
        this.initializeErrorMiddleware();
    }
    private initializeRoutes(routes : Route[]){
        routes.forEach((route) => {
            Logger.info(route.router);
            this.app.use('/' , route.router);
        })
    }

    public listen(){
        this.app.listen(this.port , ()=>{
            Logger.info(`Server is listening on port ${this.port}`); 
        })
    }

    private async connectToDatabase(){
        try{
            const connectionString  = process.env.MONGODB_URI;
            if(!connectionString){
                Logger.error('Connection string not define');
                return;
            }
            await mongoose.connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
              });
              Logger.info("Connect DB successful")
        }
        catch(error){
            Logger.error("Connect DB error")
        }
    }

    private initializeMiddlewares(){
        if(this.production){
            this.app.use(hpp());
            this.app.use(morgan("combined"));
            this.app.use(helmet());
            this.app.use(cors({origin:'domain.com', credentials:true}));
        }else{
            this.app.use(morgan("dev"));
            this.app.use(cors({origin:true, credentials:true}));
        }

        //allow json data express
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:true}));
        //custom middleware
        //this.app.use(errorMiddleware);
    }

    private initializeErrorMiddleware(){
        this.app.use(errorMiddleware);
    }

}

export default App;