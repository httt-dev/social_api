import 'dotenv/config';
import App from "./app";
import { validateEnv } from '@core/utils';
import { IndexRoute } from "@modules/index";
import { UsersRoute } from '@modules/users';
import { AuthRoute } from '@modules/auth';


validateEnv();
const routes = [new IndexRoute(), new UsersRoute() , new AuthRoute()];
const app = new App(routes);
app.listen();