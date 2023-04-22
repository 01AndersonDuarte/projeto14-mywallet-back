import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from 'uuid';

export async function signup(req, res) {
    const { name, email, password } = req.body;
    const encryptedPassword = bcrypt.hashSync(password, 10);

    try {
        const user = await db.collection("users").findOne({ email });
        if (user) return res.status(409).send("Já existe uma conta com este endereço de email.");

        await db.collection("users").insertOne({ name, email, password: encryptedPassword });

        const newUser = await db.collection("users").findOne({ email });
        await db.collection("AllTransactions").insertOne(
            {
                userId: newUser._id,
                name: newUser.name,
                transactions:
                {
                    outflow: [],
                    inflow: []
                }
            });
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function signin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await db.collection("users").findOne({ email });
        const token = uuid();

        if (!user) return res.status(404).send("Email não cadastrado.");
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).send("Senha incorreta.");

        await db.collection("sessions").insertOne({ userId: user._id, token });
        return res.status(200).send({ token: token });
    } catch (error) {
        res.status(500).send(error.message);
    }
}