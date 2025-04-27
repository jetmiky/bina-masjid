import admin from "firebase-admin";
import express from "express";
import { z, ZodError } from "zod";
import { getAsyncErrorMessage } from "../utils/errors";

const router = express.Router();

router.post("/register", async (req, res) => {
    const schema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(8),
    });

    try {
        const body = schema.parse(req.body);

        const { email, uid } = await admin.auth().createUser({
            displayName: body.name,
            email: body.email,
            password: body.password,
        });

        res.status(200).json({
            message: "Registration successful",
            success: true,
            data: { uid, email },
        });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: error.message,
                success: false,
            });

            return;
        }

        const message = getAsyncErrorMessage(error);
        res.status(500).json({
            message,
            success: false,
        });
    }
});

router.post("/login", (req, res) => {});

export default router;
