import PDFDocument from "../pdf";
import type Mosque from "../../types/Mosque";

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
            .text("Finance Report", 50, 125, { align: "center" });

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

    private generateQR(): void {
        const WEBSITE_URL = "https://";
        const { uid } = this.mosque;

        console.log(WEBSITE_URL + uid);
    }
}
