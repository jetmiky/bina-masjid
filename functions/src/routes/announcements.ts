import { FirebaseFirestoreError } from "firebase-admin/firestore";
import { type Request, Router } from "express";
import { z, ZodError } from "zod";
import { type AuthenticatedRequest, validateToken } from "../utils/tokens";
import { getAsyncErrorMessage } from "../utils/errors";
import db from "../utils/db";

const router = Router({ mergeParams: true });

router.get("/", async (req: Request<{ uid: string }>, res) => {
    try {
        const mosque = db.mosques().doc(req.params.uid);

        if (!(await mosque.get()).exists) {
            res.status(404).json({ success: false, message: "Mosque not found" });
            return;
        }

        const announcements = await db.announcements(req.params.uid).get();
        const data = announcements.docs.map((doc) => doc.data());

        res.status(200).send({ success: true, data });
    } catch (error) {
        if (error instanceof FirebaseFirestoreError) {
            res.status(400).json({ success: false, message: error.message });
        }

        res.status(500).json({ success: false, message: getAsyncErrorMessage(error) });
    }
});

router.post("/", validateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (req.user?.uid !== req.params.uid) {
            res.status(401).json({ message: "Unauthorized", success: false });
            return;
        }

        const schema = z.object({
            title: z.string().min(3),
            description: z.string(),
        });

        const body = schema.parse(req.body);

        const announcement = {
            id: db.announcements(req.params.uid).doc().id,
            ...body,
        };

        await db.announcements(req.params.uid).doc(announcement.id).set(announcement);

        res.status(201).json({
            message: "Announcement created",
            data: announcement,
            success: true,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: JSON.parse(error.message),
                success: false,
            });

            return;
        }

        if (error instanceof FirebaseFirestoreError) {
            res.status(400).json({ success: false, message: error.message });
        }

        res.status(500).json({ success: false, message: getAsyncErrorMessage(error) });
    }
});

router.delete("/:id", validateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (req.user?.uid !== req.params.uid) {
            res.status(401).json({ message: "Unauthorized", success: false });
            return;
        }

        const announcement = db.announcements(req.params.uid).doc(req.params.id);

        if (!(await announcement.get()).exists) {
            res.status(404).json({ success: false, message: "Announcement not found" });
            return;
        }

        await announcement.delete();

        res.status(200).json({
            message: "Announcement deleted",
            data: { id: announcement.id },
            success: true,
        });
    } catch (error) {
        if (error instanceof FirebaseFirestoreError) {
            res.status(400).json({ success: false, message: error.message });
        }

        res.status(500).json({ success: false, message: getAsyncErrorMessage(error) });
    }
});

export default router;
