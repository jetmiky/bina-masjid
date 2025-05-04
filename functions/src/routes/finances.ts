import { type Request, type Response, Router } from "express";
import { z } from "zod";
import { validateToken } from "../utils/tokens";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import db from "../utils/db";
import { timestampFromISODateString } from "../utils/formats";
import PDFDocument from "../utils/pdf";
import type Mosque from "../types/Mosque";
import type FinanceRecord from "../types/FinanceRecord";

const router = Router({ mergeParams: true });

router.get("/", async (req: Request<{ uid: string }>, res: Response) => {
    const mosqueDocument = await db.mosques().doc(req.params.uid).get();

    if (!mosqueDocument.exists) {
        throw new NotFoundError("Mosque not found");
    }

    const mosque = mosqueDocument.data() as Mosque;

    const schema = z.object({
        start_date: z.coerce.date().optional(),
        end_date: z.coerce.date().optional(),
    });

    const query = schema.parse(req.query);
    let q = db.finances(req.params.uid).select("type", "date", "amount", "description");

    if (query.start_date) {
        const startDate = timestampFromISODateString(new Date(query.start_date).toISOString());
        q = q.where("date", ">=", startDate);
    }

    if (query.end_date) {
        const endDate = new Date(query.end_date);
        endDate.setDate(endDate.getDate() + 1);

        q = q.where("date", "<", endDate);
    }

    const records = await q.orderBy("date", "desc").get();
    const data = records.docs.map((record) => {
        const d = record.data() as FinanceRecord;

        return {
            ...d,
            date: d.date.toDate().toISOString(),
        };
    });

    const document = new PDFDocument();

    document.on("end", () => {
        const data = document.getBuffersData();

        res.writeHead(200, {
            "Content-Length": Buffer.byteLength(data),
            "Content-Type": "application/pdf",
            "Content-disposition": "attachment;filename=report.pdf",
        }).end(data);
    });

    document.fontSize(24).text("Finance Report", { align: "center" });
    document.fontSize(16).moveDown(2).text(mosque.name);
    document.fontSize(16).moveDown(2).text(mosque.address);
    document.fontSize(16).moveDown(2).text(mosque.phone);

    // Add table headers and rows manually
    document
        .fontSize(12)
        .text("Date", { continued: true })
        .text(" | ", { continued: true })
        .text("Type", { continued: true })
        .text(" | ", { continued: true })
        .text("Amount", { continued: true })
        .text(" | ", { continued: true })
        .text("Description");
    document.moveDown();

    for (const record of data) {
        document
            .text(record.date, { continued: true })
            .text(" | ", { continued: true })
            .text(record.type, { continued: true })
            .text(" | ", { continued: true })
            .text(record.amount.toString(), { continued: true })
            .text(" | ", { continued: true })
            .text(record.description);
        document.moveDown();
    }

    document.end();
});

router.post("/", validateToken, async (req: Request, res: Response) => {
    if (req.user?.uid !== req.params.uid) {
        throw new UnauthorizedError("Unauthorized");
    }

    const schema = z.object({
        type: z.enum(["income", "expense"]),
        amount: z.number().min(1),
        description: z.string().min(3),
        date: z.coerce.date(),
    });

    const body = schema.parse(req.body);

    const record = {
        ...body,
        id: db.finances(req.params.uid).doc().id,
        date: timestampFromISODateString(body.date),
    };

    await db.finances(req.params.uid).doc(record.id).set(record);

    res.status(201).json({
        message: "Finance Record created",
        data: { ...record, date: record.date.toDate().toISOString() },
        success: true,
    });
});

router.put("/:id", validateToken, async (req: Request, res: Response) => {
    if (req.user?.uid !== req.params.uid) {
        throw new UnauthorizedError("Unauthorized");
    }

    const record = db.finances(req.params.uid).doc(req.params.id);

    if (!(await record.get()).exists) {
        throw new NotFoundError("Finance Record not found");
    }

    const schema = z.object({
        type: z.enum(["income", "expense"]),
        amount: z.number().min(1),
        description: z.string().min(3),
        date: z.coerce.date(),
    });

    const body = schema.parse(req.body);

    await db
        .finances(req.params.uid)
        .doc(req.params.id)
        .update({
            ...body,
            id: db.finances(req.params.uid).doc().id,
            date: timestampFromISODateString(body.date),
        });

    res.status(200).json({
        message: "Finance Record updated",
        data: {
            id: req.params.id,
            ...body,
        },
        success: true,
    });
});

router.delete("/:id", validateToken, async (req: Request, res: Response) => {
    if (req.user?.uid !== req.params.uid) {
        throw new UnauthorizedError("Unauthorized");
    }

    const record = db.finances(req.params.uid).doc(req.params.id);

    if (!(await record.get()).exists) {
        throw new NotFoundError("Finance Record not found");
    }

    await record.delete();

    res.status(200).json({
        message: "Finance Record deleted",
        data: { id: record.id },
        success: true,
    });
});

export default router;
