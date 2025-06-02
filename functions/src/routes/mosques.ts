import admin from "firebase-admin";
import { type Request, Router } from "express";
import { z } from "zod";
import { validateToken } from "../utils/tokens";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/errors";
import db from "../utils/db";

import qr from "./qr";
import announcements from "./announcements";
import finances from "./finances";

import multipart from "../utils/multipart";
import { upload } from "../utils/storage";

const router = Router();

router.get("/", async (req, res) => {
    const schema = z.object({
        limit: z.coerce.number().min(1).max(10).default(3),
    });

    const { limit } = schema.parse(req.query);

    const mosques = await db.mosques().limit(limit).get();
    const data = mosques.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));

    res.status(200).json({ success: true, data });
});

router.get("/:uid", async (req, res) => {
    const document = await db.mosques().doc(req.params.uid).get();

    if (!document.exists) {
        throw new NotFoundError("Mosque not found");
    }

    const { email } = await admin.auth().getUser(req.params.uid);

    res.status(200).json({
        success: true,
        data: { ...document.data(), email },
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

    const updatedData = await db.mosques().doc(req.params.uid).get();

    res.status(200).json({
        message: "Mosque updated",
        data: { ...updatedData.data() },
        success: true,
    });
});

router.put("/:uid/image", validateToken, multipart("image"), async (req: Request, res) => {
    if (req.user?.uid !== req.params.uid) {
        throw new UnauthorizedError("Unauthorized");
    }

    const image = req.files?.image;
    if (!image) {
        throw new BadRequestError("Cannot read profile image");
    }

    const { extension, mimeType, buffer } = image;
    const url = await upload("mosques", "random", extension, mimeType, buffer, true);

    await db.mosques().doc(req.params.uid).update({ img: url });
    const mosque = await db.mosques().doc(req.params.uid).get();

    return res
        .status(200)
        .json({ message: "Image uploaded", data: { ...mosque.data() }, success: true });
});

router.use("/:uid/qr", qr);
router.use("/:uid/announcements", announcements);
router.use("/:uid/finances", finances);

export default router;
