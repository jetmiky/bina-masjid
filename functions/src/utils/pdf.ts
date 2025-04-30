import PDFKit from "pdfkit";

export default class PDFDocument extends PDFKit {
    private buffers: Uint8Array[] = [];

    constructor() {
        super({ bufferPages: true });
        this.on("data", this.buffers.push.bind(this.buffers));
    }

    public getBuffersData(): Buffer<ArrayBuffer> {
        return Buffer.concat(this.buffers);
    }
}
