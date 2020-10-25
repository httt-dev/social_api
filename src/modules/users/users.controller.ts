import { TokenData } from "@modules/auth";
import { NextFunction, Request, Response } from "express";
import RegisterDto from "./dtos/register.dto";
import UserService from "./users.service";

export default class UserController{
    private userService = new UserService();
    /**
     * Register new user
     * @param req 
     * @param res 
     * @param next 
     */
    public register = async(req : Request , res:Response , next : NextFunction)=> {
        try{
            const model : RegisterDto = req.body;
            const tokenData : TokenData= await this.userService.createUser(model);
            res.status(201).json(tokenData);
        }catch(error){
            next(error); 
        }
    }

    /**
     * Get user by id 
     * @param req 
     * @param res 
     * @param next 
     */
    public getUserById = async (req : Request, res : Response , next : NextFunction) =>{
        try{
            const userId : string = req.params.id;
            const user = await this.userService.getUserById(userId);
            res.status(200).json(user);
    
        }catch(error){
            next(error);
        }
    }

    public updateUser= async ( req:Request , res:Response , next : NextFunction)=>{
        try{
            const model : RegisterDto = req.body;
            const user = await this.userService.updateUser(req.params.id, model);
            res.status(200).json(user);
            
        }catch(error){
            next(error);
        }
    }

}