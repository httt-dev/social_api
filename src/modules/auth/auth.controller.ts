import { NextFunction, Request, Response } from "express";
import { TokenData } from ".";
import LoginDto from "./auth.dto";
import AuthService from "./auth.service";

export default class AuthController {

    private authService = new AuthService();

    public login = async (req : Request , res:Response , next : NextFunction) => {
        try{
            const model : LoginDto = req.body;
            const token : TokenData = await this.authService.login(model);
            res.status(200).json(token);
        }catch(error){
            next ( error);
        }
    };

    public getCurrentLoginUser = async (req: Request , res: Response , next : NextFunction)=>{
        try{
            const user =  await this.authService.getCurrentLoginUser(req.user.id);
            res.status(200).json(user);
        }catch(error){
            next(error);
        }
    }
}