export default interface File {
    fieldName: string;
    originalName: string;
    encoding: string;
    mimeType: string;
    extension: string;
    size: number;
    buffer: Buffer;
}
