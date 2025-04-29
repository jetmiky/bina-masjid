import admin from "firebase-admin";
import type { UserRecord } from "firebase-admin/auth";
import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "./errors";

export interface AuthenticatedRequest extends Request {
    user?: UserRecord;
}

export const validateToken = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
) => {
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
