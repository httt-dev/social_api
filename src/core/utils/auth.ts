
import { DataStoredInToken, TokenData } from "@modules/auth";
import { IUser } from "@modules/users";
import jwt from "jsonwebtoken";

export const createToken = (user : IUser):TokenData=> {
    const payload : DataStoredInToken = {id : user._id};
    const secret : string = process.env.JWT_TOKEN_SECRET!;
    const expiresIn :number = 3600;
    return {token:jwt.sign(payload , secret,{expiresIn:expiresIn})};
}
