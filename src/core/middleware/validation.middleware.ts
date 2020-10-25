import { validate, ValidationError } from "class-validator";
import { plainToClass } from 'class-transformer';
import { NextFunction, Request, RequestHandler, Response } from "express";
import { Logger } from "@core/utils";
import { HttpException } from "@core/exceptions";

const validationMiddleware = (type : any , skipMissingProperties = false): RequestHandler =>{
    return (req : Request , res:Response , next : NextFunction) =>{
        validate(plainToClass(type,req.body) , {skipMissingProperties}).then(
            (errors: ValidationError[]) =>{
                if(errors.length>0){
                    //Logger.error(errors);
                    const message = errors.map((error:ValidationError)=>{
                        return Object.values(error.constraints!);
                    }).join(', ');

                    next(new HttpException(400, message));
                }else{
                    next();
                }
            }
        );
    };
};

export default validationMiddleware;