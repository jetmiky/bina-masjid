import type Announcements from "./Announcement";
import type FinanceRecord from "./FinanceRecord";

export default interface Mosque {
    uid: string;
    address: string;
    phone: string;
    announcements?: Announcements[];
    finances?: FinanceRecord[];
}
