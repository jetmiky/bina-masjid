import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import express from "express";

const app = express();

app.use(express.json());

app.get("/ping", (_, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase API");
});

export const api = onRequest(app);
