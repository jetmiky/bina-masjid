import admin from "firebase-admin";
import { Router } from "express";
import { z, ZodError } from "zod";
import { type AuthenticatedRequest, validateToken } from "../utils/tokens";
import { getAsyncErrorMessage } from "../utils/errors";

import announcements from "./announcements";

const router = Router();

router.get("/:uid", async (req, res) => {
    const document = await admin.firestore().collection("mosques").doc(req.params.uid).get();
    document.exists
        ? res.status(200).json({
              success: true,
              data: { ...document.data() },
          })
        : res.status(404).json({
              success: false,
              message: "Mosque not found",
          });
});

router.put("/:uid", validateToken, async (req: AuthenticatedRequest, res) => {
    if (req.user?.uid !== req.params.uid) {
        res.status(401).json({ message: "Unauthorized", success: false });
        return;
    }

    const schema = z.object({
        address: z.string(),
        phone: z.string(),
    });

    try {
        const body = schema.parse(req.body);
        await admin.firestore().collection("mosques").doc(req.params.uid).update(body);

        res.status(200).json({ message: "Mosque updated", data: body, success: true });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: JSON.parse(error.message),
                success: false,
            });

            return;
        }

        const message = getAsyncErrorMessage(error);
        res.status(500).json({ message, success: false });
    }
});

router.use("/:uid/announcements", announcements);

export default router;
