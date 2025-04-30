import logger from "firebase-functions/logger";
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class BadRequestError extends Error {}
export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}
export class InternalServerError extends Error {}

/**
 * Extract error message from Error object.
 *
 * @param {unknown} error   Unknown errors.
 * @return {string} Returns message of Error object.
 */
export function getAsyncErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

/**
 * Global error handlers, used as middleware.
 *
 * @param {Error} error Unknown errors.
 * @param {Request} request Express Request object.
 * @param {Response} response   Express Response object.
 * @param {NextFunction} next   Express NextFunction object.
 * @return {Promise<void>}
 */
export async function errorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    let message = getAsyncErrorMessage(error);

    if (error instanceof ZodError) {
        message = error.errors.map((e) => `${e.path}: ${e.message}`).join(".\n ");

        response.status(400).json({ message, success: false });
        return;
    }

    if (error instanceof BadRequestError) {
        response.status(400).json({ message, success: false });
        return;
    }

    if (error instanceof UnauthorizedError) {
        response.status(401).json({ message, success: false });
        return;
    }

    if (error instanceof ForbiddenError) {
        response.status(403).json({ message, success: false });
        return;
    }

    if (error instanceof NotFoundError) {
        response.status(404).json({ message, success: false });
        return;
    }

    logger.error(message);
    response.status(500).json({ message, success: false });
}

export default errorHandler;
