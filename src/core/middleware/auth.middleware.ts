import { DataStoredInToken } from "@modules/auth";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = ( req : Request , res: Response , next: NextFunction)=>{
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({message:'Authorization denied.'});
    }
    try{
        const user = jwt.verify(token , process.env.JWT_TOKEN_SECRET!) as DataStoredInToken;
        if(!req.user) req.user ={id:""};
        //can phai add them types vao request
        //gan user vao reequest
        req.user.id = user.id;
        //next process
        next();
    }catch(error){
        res.status(401).json({message:'Token is invalid'});
    }
}

export default authMiddleware;