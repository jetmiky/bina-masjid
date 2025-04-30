import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";
import express, { type Request, type Response } from "express";
import cors from "cors";
import errorHandler from "./utils/errors";

import multipart from "./utils/multipart";
import { upload } from "./utils/storage";
import PDFDocument from "./utils/pdf";

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

app.get("/pdf", async (request: Request, response: Response) => {
    const doc = new PDFDocument();

    doc.on("end", () => {
        const data = doc.getBuffersData();

        response
            .writeHead(200, {
                "Content-Length": Buffer.byteLength(data),
                "Content-Type": "application/pdf",
                "Content-disposition": "attachment;filename=report.pdf",
            })
            .end(data);
    });

    doc.fontSize(24).text("Receipt").fontSize(16).moveDown(2).text("This is your receipt!");

    doc.end();
});

app.post("/image", multipart("image"), async (request: Request, response) => {
    const image = request.files?.image;

    const imageUrls: string[] = [];
    const images = [];

    if (image) images.push(image);

    for (const file of images) {
        const { extension, mimeType, buffer } = file;
        const url = await upload("mosques", "random", extension, mimeType, buffer, true);

        imageUrls.push(url);
    }

    response.status(200).json({ imageUrls });
});

app.get("/ping", (request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase API");
});

app.use(errorHandler);

export const api = onRequest(app);
