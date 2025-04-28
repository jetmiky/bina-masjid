import { Router } from "express";
import { z, ZodError } from "zod";
import { type AuthenticatedRequest, validateToken } from "../utils/tokens";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/errors";
import db from "../utils/db";

import announcements from "./announcements";

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

router.put("/:uid", validateToken, async (req: AuthenticatedRequest, res) => {
    if (req.user?.uid !== req.params.uid) {
        throw new UnauthorizedError("Unauthorized");
    }

    const schema = z.object({
        address: z.string(),
        phone: z.string(),
    });

    try {
        const body = schema.parse(req.body);
        await db.mosques().doc(req.params.uid).update(body);

        res.status(200).json({ message: "Mosque updated", data: body, success: true });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const message = error.errors.map((e) => `${e.path}: ${e.message}`).join(". ");
            throw new BadRequestError(message);
        }
    }
});

router.use("/:uid/announcements", announcements);

export default router;
