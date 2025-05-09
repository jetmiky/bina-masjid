import busboy from "busboy";
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import type { Request, Response, NextFunction } from "express";
import type File from "../types/File";

import { isValidJSON } from "./formats";

type ExtractResponse = {
    fields: { [key: string]: string | object | [] };
    files: { [key: string]: File };
};

/**
 * Middleware to handle files upload.
 * Executed on 'multipart/form-data' content-type headers.
 *
 * @param {string | string[]} fieldNames Only filters provided fieldnames.
 * @return {Function<void>} Returns function as Express middleware
 */
function multipart(
    fieldNames: string | string[],
): (request: Request, response: Response, next: NextFunction) => void {
    const filteredNames = typeof fieldNames === "string" ? [fieldNames] : fieldNames;

    return async (request: Request, response: Response, next: NextFunction) => {
        const contentTypeHeader = request.headers["content-type"];
        if (!contentTypeHeader?.startsWith("multipart/form-data")) {
            return next();
        }

        const { files, fields } = await extract(request, filteredNames);

        request.body = fields;
        request.files = files;

        next();
    };
}

/**
 * Extract form-data request body using busboy.
 *
 * @param { Request } req Express Request object
 * @param { string[] } fieldNames Filtered field names
 * @return { Promise<ExtractResponse> } Extraction of fields and files
 */
function extract(req: Request, fieldNames: string[]): Promise<ExtractResponse> {
    return new Promise((resolve, reject) => {
        const bb = busboy({
            headers: req.headers,
            limits: { fileSize: 10 * 1024 * 1024 },
        });

        const fields: { [key: string]: string } = {};
        const files: { [key: string]: File } = {};
        const fileWrites: Promise<void>[] = [];

        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
        const tmpdir = os.tmpdir();

        bb.on("field", (key, value) => {
            if (isValidJSON(value)) {
                fields[key] = JSON.parse(value);
            } else {
                fields[key] = value;
            }
        });

        bb.on("file", (fieldName, stream, metadata) => {
            if (!(fieldNames.length && fieldNames.includes(fieldName))) {
                return;
            }

            const { filename, encoding, mimeType } = metadata;
            const splittedName = filename.split(".");
            const extension = splittedName.pop() as string;
            const originalName = splittedName.join(".");

            const filepath = path.join(tmpdir, filename);

            const writeStream = fs.createWriteStream(filepath);
            stream.pipe(writeStream);

            fileWrites.push(
                new Promise((resolve, reject) => {
                    stream.on("end", () => writeStream.end());

                    writeStream.on("finish", () => {
                        fs.readFile(filepath, (err, buffer) => {
                            const size = Buffer.byteLength(buffer);

                            if (err) return reject(err);

                            files[fieldName] = {
                                fieldName,
                                originalName,
                                encoding,
                                extension,
                                mimeType,
                                buffer,
                                size,
                            };

                            fs.unlinkSync(filepath);
                            resolve();
                        });
                    });

                    writeStream.on("error", reject);
                }),
            );
        });

        bb.on("close", async () => {
            await Promise.all(fileWrites);
            resolve({ fields, files });
        });

        bb.on("error", reject);
        bb.on("partsLimit", () => reject(new Error("LIMIT_PART_COUNT")));
        bb.on("filesLimit", () => reject(new Error("LIMIT_FILE_COUNT")));
        bb.on("fieldsLimit", () => reject(new Error("LIMIT_FIELD_COUNT")));

        if (req.body) {
            bb.end(req.body);
        } else {
            req.pipe(bb);
        }
    });
}

export default multipart;
