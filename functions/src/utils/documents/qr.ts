import PDFDocument from "../pdf";
import type Mosque from "../../types/Mosque";
import { toCanvas } from "qrcode";
import { createCanvas } from "canvas";

export default class QRDocument extends PDFDocument {
    private mosque: Mosque;

    constructor(mosque: Mosque) {
        super({ margin: 50, size: "A4" });
        this.mosque = mosque;
    }

    public generate(): void {
        this.generateHeader();
        this.generateQR();
        this.generateFooter();
    }

    private generateHeader(): void {
        const { name, address } = this.mosque;

        this.font("Helvetica").fontSize(20).text(name, 50, 65);

        this.fontSize(16)
            .font("Helvetica-Bold")
            .text("Visit Our Profile", 50, 150, { align: "center" });

        this.font("Helvetica")
            .fontSize(10)
            .text(address.street, 200, 65, { align: "right" })
            .text(`${address.city}, ${address.province}`, 200, 80, { align: "right" })
            .text(address.zip, 200, 95, { align: "right" })
            .moveDown();
    }

    private generateFooter(): void {
        this.font("Helvetica-Bold", 10).text("Bina Masjid Digital", 50, 768, { align: "center" });
        this.font("Helvetica", 10).text(
            "Modernizing mosque management for the digital age",
            50,
            780,
            {
                align: "center",
            },
        );
    }

    private async generateQR(): Promise<void> {
        const WEBSITE_URL = process.env.WEBSITE_URL;
        const { uid } = this.mosque;
        const URL = `${WEBSITE_URL}/mosque.html?id=${uid}`;

        const IMAGE_SIZE = 250;

        const canvas = createCanvas(IMAGE_SIZE, IMAGE_SIZE);
        toCanvas(canvas, URL, {
            errorCorrectionLevel: "H",
            margin: 1,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        });

        const qr = canvas.toDataURL("image/png");

        this.image(qr, this.page.width / 2 - IMAGE_SIZE / 2, IMAGE_SIZE, {
            fit: [IMAGE_SIZE, IMAGE_SIZE],
            width: IMAGE_SIZE,
        });
    }
}
