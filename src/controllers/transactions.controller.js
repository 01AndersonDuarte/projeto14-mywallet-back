import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getTransactions(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) return res.sendStatus(401);

    try {
        const activeUser = await db.collection("sessions").findOne({ token });
        if (!activeUser) return res.status(401).send("Usuário não ativo.");

        const transactionsUser = await db.collection("AllTransactions").findOne(
            {
                userId: activeUser.userId
            });
        if (!transactionsUser) return res.status(500).send("Server error");
        res.status(200).send(
            {
                name: transactionsUser.name,
                transactions: transactionsUser.transactions
            });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function addTransaction(req, res) {
    const { value, description } = req.body;

    const today = dayjs().format("DD/MM");
    const valueFloat = parseFloat(value).toFixed(2);
    const newTransaction = { date: today, value: valueFloat, description: description };

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    const { type } = req.query;
    console.log(type);
    if (type !== 'outflow' && type !== 'inflow') return res.sendStatus(400);//Dá pra fazer com joi

    try {
        const activeUser = await db.collection("sessions").findOne({ token });
        if (!activeUser) return res.status(401).send("Usuário não ativo.");

        await db.collection("AllTransactions").updateOne(
            {
                userId: activeUser.userId
            },
            {
                $push:
                    { [`transactions.${type}`]: newTransaction }
            });
        res.status(201).send("Transação concluída");
    } catch (error) {
        res.status(500).send(error.message);
    }
}