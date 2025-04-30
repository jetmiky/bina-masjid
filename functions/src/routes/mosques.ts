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
        address: z.string(),
        phone: z.string(),
    });

    const body = schema.parse(req.body);
    await db.mosques().doc(req.params.uid).update(body);

    res.status(200).json({ message: "Mosque updated", data: body, success: true });
});

router.use("/:uid/announcements", announcements);
router.use("/:uid/finances", finances);

export default router;
