import admin from "firebase-admin";
import { FirebaseFirestoreError } from "firebase-admin/firestore";
import { type Request, Router } from "express";
import { type AuthenticatedRequest, validateToken } from "../utils/tokens";
import { getAsyncErrorMessage } from "../utils/errors";

const router = Router({ mergeParams: true });

router.get("/", async (req: Request<{ uid: string }>, res) => {
    try {
        const announcements = await admin
            .firestore()
            .collection("mosques")
            .doc(req.params.uid)
            .collection("announcements")
            .get();

        const data = announcements.docs.map((doc) => doc.data());

        res.status(200).send({ success: true, data });
    } catch (error) {
        if (error instanceof FirebaseFirestoreError) {
            res.status(400).json({ success: false, message: error.message });
        }

        res.status(500).json({ success: false, message: getAsyncErrorMessage(error) });
    }
});

router.post("/", validateToken, async (req: AuthenticatedRequest, res) => {});

router.delete("/:id", validateToken, async (req: AuthenticatedRequest, res) => {});

export default router;
