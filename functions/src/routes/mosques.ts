import admin from "firebase-admin";
import { type Request, Router } from "express";
import { z } from "zod";
import { validateToken } from "../utils/tokens";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import db from "../utils/db";

import announcements from "./announcements";
import finances from "./finances";

const router = Router();

router.get("/:uid", async (req, res) => {
    const document = await db.mosques().doc(req.params.uid).get();

    if (!document.exists) {
        throw new NotFoundError("Mosque not found");
    }

    res.status(200).json({
        success: true,
        data: { ...document.data() },
    });
});

router.put("/:uid", validateToken, async (req: Request, res) => {
    if (req.user?.uid !== req.params.uid) {
        throw new UnauthorizedError("Unauthorized");
    }

    const schema = z.object({
        name: z.string().min(3),
        address: z.object({
            street: z.string().min(3),
            city: z.string().min(3),
            province: z.string().min(3),
            zip: z.coerce.number().int().gte(10000).lte(99999),
        }),
        phone: z.string().min(3),
    });

    const body = schema.parse(req.body);
    const mosque = { ...body, address: { ...body.address, zip: String(body.address.zip) } };

    await db.mosques().doc(req.params.uid).update(mosque);
    await admin.auth().updateUser(req.params.uid, { displayName: body.name });

    res.status(200).json({ message: "Mosque updated", data: mosque, success: true });
});

router.use("/:uid/announcements", announcements);
router.use("/:uid/finances", finances);

export default router;
