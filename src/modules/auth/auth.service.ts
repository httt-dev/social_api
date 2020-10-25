import { HttpException } from "@core/exceptions"
import { createToken, isEmptyObject } from "@core/utils"
import { IUser, UserSchema } from "@modules/users"
import { DataStoredInToken, TokenData } from '@modules/auth';
import LoginDto from "./auth.dto"
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default class AuthService {
    public userSchema = UserSchema;

    public async login(model:LoginDto) :Promise<TokenData> {
     
        if(isEmptyObject(model)){
            throw new HttpException(400, "Model is empty");
        }
        // const user = await this.userSchema.findOne({email:model.email});
        const user = await this.userSchema.findOne({email:model.email}).exec();
        if(!user){
            throw new HttpException(409 , `Your email ${model.email} is not register`);
        }
        //check password 
        const isMatchPassword = await bcryptjs.compare(model.password , user.password);
        if(!isMatchPassword){
            throw new HttpException(400,"Credential is not valid");
        }
        //call create token from ultis auth
        return createToken(user);

    }


    // private createToken(user : IUser):TokenData{
    //     const payload : DataStoredInToken = {id : user._id};
    //     const secret : string = process.env.JWT_TOKEN_SECRET!;
    //     const expiresIn :number = 3600;
    //     return {token:jwt.sign(payload , secret,{expiresIn:expiresIn})};
    // }

    public async getCurrentLoginUser(userId:string):Promise<IUser> {
        // const user = await this.userSchema.findById(userId);
        const user = await this.userSchema.findById(userId).exec();
        if(!user){
            throw new HttpException(404, `User is not exists`);
        }
        return user;
    }
}