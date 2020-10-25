import { Route } from "@core/interfaces";
import { validationMiddleware } from "@core/middleware";
import { Router } from "express";
import RegisterDto from "./dtos/register.dto";
import UserController from "./users.controller";

export default class UsersRoute implements Route{
    public path ='/api/users';
    public router = Router();
    public usersController = new UserController();
    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //POST : http://localhost:5000/api/users
        this.router.post(this.path, validationMiddleware(RegisterDto, true), this.usersController.register);
    }
}