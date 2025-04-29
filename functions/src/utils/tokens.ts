import admin from "firebase-admin";
import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "./errors";

export const validateToken = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const authorization = request.headers.authorization ?? "";
        const [, token] = authorization.split("Bearer ");

        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = await admin.auth().getUser(decodedToken.uid);

        request.user = user;

        next();
    } catch (error) {
        throw new UnauthorizedError("Unauthorized");
    }
};
