import type { Timestamp } from "firebase-admin/firestore";
import type Mosque from "./Mosque";

export default interface FinanceRecord {
    id: string;
    type: "income" | "expense";
    amount: number;
    date: Timestamp;
    description: string;
    mosque?: Mosque;
}
