import { type Request, type Response, Router } from "express";
import QRDocument from "../utils/documents/qr";
import db from "../utils/db";
import type Mosque from "../types/Mosque";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import { validateToken } from "../utils/tokens";

const router = Router({ mergeParams: true });

router.get("/", validateToken, async (req: Request<{ uid: string }>, res: Response) => {
    if (req.user?.uid !== req.params.uid) {
        throw new UnauthorizedError("Unauthorized");
    }

    const mosqueDocument = await db.mosques().doc(req.params.uid).get();

    if (!mosqueDocument.exists) {
        throw new NotFoundError("Mosque not found");
    }

    const mosque = { ...mosqueDocument.data(), uid: req.params.uid } as Mosque;
    const document = new QRDocument(mosque);

    document.on("end", () => {
        const data = document.getBuffersData();

        res.writeHead(200, {
            "Content-Length": Buffer.byteLength(data),
            "Content-Type": "application/pdf",
            "Content-disposition": "attachment;filename=QRCode.pdf",
        }).end(data);
    });

    document.generate();
    document.end();
});

export default router;
