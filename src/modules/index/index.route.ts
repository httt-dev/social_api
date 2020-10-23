import { Router } from "express";
import { Route } from "src/core/interfaces";
import IndexController from "./index.controller";

export default class IndexRoute implements Route{
    public path = '/';
    public router = Router();

    public indexController = new IndexController();

    constructor(){

        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get(this.path , this.indexController.index);
    }


}