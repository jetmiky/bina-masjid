import admin from "firebase-admin";
import { FirebaseAuthError } from "firebase-admin/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
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

        await admin.firestore().collection("mosques").doc(uid).create({
            address: "",
            phone: "",
        });

        res.status(200).json({
            message: "Registration successful",
            success: true,
            data: { uid, email },
        });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: JSON.parse(error.message),
                success: false,
            });

            return;
        }

        const message = getAsyncErrorMessage(error);
        if (error instanceof FirebaseAuthError) {
            res.status(400).json({
                message,
                success: false,
            });

            return;
        }

        res.status(500).json({
            message,
            success: false,
        });
    }
});

router.post("/login", async (req, res) => {
    const schema = z.object({
        email: z.string().email(),
        password: z.string(),
    });

    try {
        const body = schema.parse(req.body);

        const { user } = await signInWithEmailAndPassword(auth, body.email, body.password);
        if (user) {
            const token = await user.getIdToken();

            res.status(200).json({
                message: "Login successful",
                success: true,
                data: { uid: user.uid, email: user.email, token },
            });
        } else {
            res.status(400).json({
                message: "Invalid credentials",
                success: false,
            });
        }
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: JSON.parse(error.message),
                success: false,
            });

            return;
        }

        const message = getAsyncErrorMessage(error);
        if (error instanceof FirebaseAuthError) {
            res.status(400).json({
                message,
                success: false,
            });

            return;
        }

        res.status(500).json({
            message,
            success: false,
        });
    }
});

export default router;
