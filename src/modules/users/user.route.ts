import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import RegisterDto from "./dtos/register.dto";
import UserController from "./users.controller";

export default class UsersRoute implements Route {
	public path = "/api/users";
	public router = Router();
	public usersController = new UserController();
	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		//POST : http://localhost:5000/api/users
		this.router.post(
			this.path,
			validationMiddleware(RegisterDto, true),
			this.usersController.register
		);

		//PUT : http://localhost:5000/api/users
		this.router.put(
			this.path + "/:id",
			validationMiddleware(RegisterDto, true),
			this.usersController.updateUser
		);

		//GET : http://localhost:5000/api/users/id
		this.router.get(this.path + "/:id", this.usersController.getUserById);

		//GET : http://localhost:5000/api/users
		this.router.get(this.path, this.usersController.getAll);

		//GET : http://localhost:5000/api/users/paging/page?keyword=abc
		this.router.get(
			this.path + "/paging/:page",
			this.usersController.getAllPaging
		);

		//DELETE : http://localhost:5000/api/users/id(id=6fjfjfkd84ndkfkkdkadfdakf)
		this.router.delete(
			this.path + "/:id",
			authMiddleware,
			this.usersController.deleteUser
		);
	}
}
