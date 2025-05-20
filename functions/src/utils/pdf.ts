import PDFKit from "pdfkit";
import type Mosque from "../types/Mosque";
import { speakCurrency } from "./formats";

export default class PDFDocument extends PDFKit {
    private buffers: Uint8Array[] = [];

    constructor(options: PDFKit.PDFDocumentOptions = {}) {
        super({ ...options, bufferPages: true });
        this.on("data", this.buffers.push.bind(this.buffers));
    }

    public getBuffersData(): Buffer<ArrayBuffer> {
        return Buffer.concat(this.buffers);
    }
}

export class FinanceReport extends PDFDocument {
    public mosque: Mosque;

    constructor(mosque: Mosque) {
        super({ margin: 50, size: "A4" });
        this.mosque = mosque;

        this.generateHeader();
        this.generateTable();
        this.generateFooter();
    }

    public generate(): void {
        this.generateHeader();
        this.generateTable();
        this.generateFooter();
    }

    private generateLine(y: number): void {
        const start = 50;
        const end = this.page.width - start;

        this.moveTo(start, y).lineTo(end, y).stroke();
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

    private generateTable() {
        this.generateTableHeader(175);

        let y = 205;
        for (const record of this.mosque.finances ?? []) {
            const date = record.date.toDate().toISOString().split("T")[0];
            const description = record.description;
            const type = record.type;
            const amount = speakCurrency(record.amount);

            this.generateTableData(y, date, description, type, amount);
            y += 25;
        }
    }

    private generateTableHeader(y: number) {
        this.font("Helvetica-Bold", 12);
        this.generateTableRow(y, "Date", "Description", "Type", "", "Amount");
        this.generateLine(y + 20);
    }

    private generateTableData(
        y: number,
        date: string,
        description: string,
        type: string,
        amount: string,
    ) {
        this.font("Helvetica", 10);
        this.generateTableRow(y, date, description, type, "Rp", amount);
        this.generateLine(y + 15);
    }

    private generateTableRow(
        y: number,
        c1: string,
        c2: string,
        c3: string,
        c4: string,
        c5: string,
    ) {
        this.text(c1, 50, y)
            .text(c2, 150, y)
            .text(c3, 370, y, { width: 90, align: "left" })
            .text(c4, 460, y, { width: 20, align: "left" })
            .text(c5, 0, y, { align: "right" });
    }
}
