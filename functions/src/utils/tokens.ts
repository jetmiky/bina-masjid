import admin from "firebase-admin";
import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "./errors";

/**
 * Validate token in authorization header.
 * To be used as express middleware.
 *
 * @param { Request } request   Express Request object.
 * @param { Response } response Express Response object.
 * @param { NextFunction } next Express NextFunction object.
 * @throws { UnauthorizedError }    Thrown when token is invalid.
 * @return { Promise<void> }    Proceed to next function if token is valid
 */
export const validateToken = async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
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
