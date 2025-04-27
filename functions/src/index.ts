import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";
import express from "express";

import auth from "./routes/auth";

admin.initializeApp();

const app = express();

app.use(express.json());

app.use("/auth", auth);

app.get("/ping", (_, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase API");
});

export const api = onRequest(app);
