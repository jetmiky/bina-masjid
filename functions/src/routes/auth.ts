import admin from "firebase-admin";
import express from "express";
import { FirebaseAuthError } from "firebase-admin/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../config/firebase";
import { z } from "zod";
import { BadRequestError, UnauthorizedError } from "../utils/errors";

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
            name: body.name,
            address: "",
            phone: "",
        });

        res.status(201).json({
            message: "Registration successful",
            success: true,
            data: { uid, email },
        });
    } catch (error: unknown) {
        if (error instanceof FirebaseAuthError) {
            throw new BadRequestError(error.message);
        }

        if (error instanceof Error) {
            throw error;
        }
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
        const token = await user.getIdToken();

        res.status(200).json({
            message: "Login successful",
            success: true,
            data: { uid: user.uid, email: user.email, token },
        });
    } catch (error: unknown) {
        if (error instanceof FirebaseError) {
            throw new UnauthorizedError(error.code);
        }

        if (error instanceof Error) {
            throw error;
        }
    }
});

export default router;
