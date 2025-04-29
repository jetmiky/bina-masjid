import type { UserRecord } from "firebase-admin/auth";
import type File from "./types/File";

/**
 * Declare files property, so can be accessed by consumers.
 *
 */
declare module "express" {
    interface Request {
        files?: { [key: string]: File };
        user?: UserRecord;
    }
}
