import type { Request, Response, NextFunction } from "express";

export class BadRequestError extends Error {}
export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}
export class InternalServerError extends Error {}

export function getAsyncErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

export async function errorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const message = getAsyncErrorMessage(error);

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

    response.status(500).json({ message, success: false });
}

export default errorHandler;
