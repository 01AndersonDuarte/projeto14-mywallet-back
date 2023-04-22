import { Router } from "express";
import routerUsers  from "./users.routes.js";
import routerTransactions from "./transactions.routes.js";

const router = Router();

router.use(routerUsers);
router.use(routerTransactions);

export default router;