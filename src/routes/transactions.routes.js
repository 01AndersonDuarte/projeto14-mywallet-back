import { Router } from "express";

import { getTransactions, addTransaction } from "../controllers/transactions.controller.js";

import { addTransactions } from "../schemas/addtransactions.schemas.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";

const routerTransactions = Router();

routerTransactions.get("/transactions", getTransactions);
routerTransactions.post("/transactions", schemaValidation(addTransactions), addTransaction);

export default routerTransactions;