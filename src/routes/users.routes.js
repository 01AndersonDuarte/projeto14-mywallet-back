import { Router } from "express";
import { signup, signin } from "../controllers/users.controller.js";
import { signUpSchema } from "../schemas/sign-up.schema.js";
import { signInSchema } from "../schemas/sign-in.schema.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";

const routerUsers = Router();

routerUsers.post("/users/signup", schemaValidation(signUpSchema), signup);
routerUsers.post("/users/signin", schemaValidation(signInSchema), signin);

export default routerUsers;