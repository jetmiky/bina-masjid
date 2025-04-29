import { getStorage } from "firebase-admin/storage";
import { v4 as uuid } from "uuid";

/**
 * Handle buffer file upload to Firebase Storage.
 *
 * @param { DirectoryPath } path  Path relative to root storage.
 * @param { string } filename     Desired file name uploaded, not include ext.
 * @param { string } extension    Extension of file uploaded.
 * @param { string } contentType  Content type of file, ie. image/png.
 * @param { Buffer } data         Buffer data of file.
 * @param { boolean } makePublic  Make the file accessible by public.
 * @return { Promise<string> }    Returns storage path of uploaded file.
 */
export async function upload(
    path: string,
    filename: string | "random",
    extension: string,
    contentType: string,
    data: Buffer,
    makePublic?: boolean,
): Promise<string> {
    const name = filename === "random" ? uuid() : filename;

    const storagePath = `${path}/${name}.${extension}`;
    const file = getStorage().bucket().file(storagePath);
    await file.save(data, { contentType });

    if (makePublic) await file.makePublic();
    const publicUrl = file.publicUrl();

    return makePublic ? publicUrl : storagePath;
}

/**
 * Get signed URL of file in Storage.
 *
 * @param { string } filepath Relative path of file to root, includes ext.
 * @return { Promise<string> } Returns signed URL of file.
 */
export async function getSignedUrl(filepath: string): Promise<string> {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const bucket = getStorage().bucket().file(filepath);
    const response = await bucket.getSignedUrl({ action: "read", expires });

    return response[0];
}

export default { upload, getSignedUrl };
