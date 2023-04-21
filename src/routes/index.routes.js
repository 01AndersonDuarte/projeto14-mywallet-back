import { Router } from "express";
import routerUsers  from "./users.routes.js";

const router = Router();

router.use(routerUsers);

export default router;