import 'dotenv/config';
import App from "./app";
import { validateEnv } from '@core/utils';
import { IndexRoute } from "@modules/index";
import { UsersRoute } from '@modules/users';

validateEnv();
const routes = [new IndexRoute(), new UsersRoute()];
const app = new App(routes);
app.listen();