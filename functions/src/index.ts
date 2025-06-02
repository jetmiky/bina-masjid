import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import errorHandler from "./utils/errors";

import auth from "./routes/auth";
import mosques from "./routes/mosques";

admin.initializeApp();

const app = express();

app.use(express.json());

if (!process.env.FUNCTIONS_EMULATOR) {
    app.use(cors({ origin: "https://bina-masjid-digital.web.app" }));
}

app.use("/auth", auth);
app.use("/mosques", mosques);

app.get("/ping", (request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase API");
});

app.use(errorHandler);

export const api = onRequest(app);
