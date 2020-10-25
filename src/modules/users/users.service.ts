import { HttpException } from "@core/exceptions";
import { isEmptyObject, Logger } from "@core/utils";
import { DataStoredInToken, TokenData } from "@modules/auth";
import RegisterDto from "./dtos/register.dto";
import UserSchema from "./users.model";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import IUser from "./users.interface";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

class UserService {
	public userSchema = UserSchema;
	/**
	 * Create user
	 * @param model
	 */
	public async createUser(model: RegisterDto): Promise<TokenData> {
		if (isEmptyObject(model)) {
			throw new HttpException(400, "Model is empty");
		}
		// const user = await this.userSchema.findOne({email:model.email});
		//use exec() to return async
		const user = await this.userSchema
			.findOne({ email: model.email })
			.exec();

		// const user = this.userSchema.findOne({email:model.email}, (err,data)=> {
		//     if(err){
		//         throw new HttpException(409, `Error when create user ${model.email}`);
		//     }
		//     if(data){
		//         throw new HttpException(409, `Your email ${model.email} already exist.`);
		//     }

		// });
		if (user) {
			throw new HttpException(
				409,
				`Your email ${model.email} already exist.`
			);
		}
		const avatar = gravatar.url(model.email, {
			size: "200",
			rating: "g",
			default: "mm",
		});
		const salt = await bcryptjs.genSalt(10);

		const hashPassword = await bcryptjs.hash(model.password!, salt);

		const createdUser: IUser = await this.userSchema.create({
			...model,
			password: hashPassword,
			avatar: avatar,
			date: Date.now(),
		});

		return this.createToken(createdUser);
	}

	/**
	 * Update user
	 * @param userId
	 * @param model
	 */
	public async updateUser(
		userId: string,
		model: RegisterDto
	): Promise<IUser> {
		//check empty model
		if (isEmptyObject(model)) {
			throw new HttpException(400, "Model is empty");
		}

		try {
			const user = await this.userSchema.findById(userId).exec();
			if (!user) {
				throw new HttpException(400, `User id is not exits`);
			}
			let avatar = user.avatar;
			//check
			if (user.email === model.email) {
				//throw new HttpException(400, `You must using the diffence email`);
			} else {
				//and condition : email = new email and _id <> userId
				const anotherUserWithEmail = await this.userSchema.find({
					$and: [{ email: model.email }, { _id: { $ne: userId } }],
				});
				if (anotherUserWithEmail) {
					throw new HttpException(
						409,
						`The new email used by another user, please change email`
					);
				}

				//get new avatar
				avatar = gravatar.url(model.email, {
					size: "200",
					rating: "g",
					default: "mm",
				});
			}

			let updateUserById;

			if (model.password) {
				Logger.info(`update user with change pass`);
				//update password
				const salt = await bcryptjs.genSalt(10);
				const hashedPassword = await bcryptjs.hash(
					model.password,
					salt
				);
				updateUserById = await this.userSchema
					.findByIdAndUpdate(
						userId,
						{
							...model,
							avatar: avatar,
							password: hashedPassword,
						},
						{ new: true }
					)
					.exec();
			} else {
				Logger.info(`update user without change pass`);
				updateUserById = await this.userSchema
					.findByIdAndUpdate(
						userId,
						{
							...model,
							avatar: avatar,
						},
						{ new: true }
					)
					.exec();
			}
			//check result
			if (!updateUserById)
				throw new HttpException(409, `You are not an user.`);

			return updateUserById;
		} catch (error) {
			if (error.name === "CastError") {
				throw new HttpException(400, `User id is not exits`);
			} else if (error.status) {
				throw error;
			} else {
				throw new HttpException(400, `Somthing error when update user`);
			}
		}

		// this.userSchema.findById(userId)
		// .then(result=>{
		//     user = result;
		//     //if return null
		//     if(!user){
		//         throw new HttpException(400,`User id is not exits`);
		//     }

		// }).catch(error=>{
		//     if (error.message instanceof mongoose.Error.CastError) {
		//         // Handle this error
		//         throw new HttpException(400,`User id is not exits`);
		//     }else{
		//         throw new HttpException(400, `Somthing error when find user by id`);
		//     }
		// })
	}

	/**
	 * Get user model by user id
	 * @param userId
	 */
	public async getUserById(userId: string): Promise<IUser> {
		// const user = await this.userSchema.findById(userId);
		const user = await this.userSchema.findById(userId).exec();
		if (!user) {
			throw new HttpException(404, `User is not exists`);
		}
		return user;
	}

	private createToken(user: IUser): TokenData {
		const dataInToken: DataStoredInToken = { id: user._id };
		const secret: string = process.env.JWT_TOKEN_SECRET!;
		const expiresIn: number = 3600;
		return {
			token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
		};
	}
}

export default UserService;
