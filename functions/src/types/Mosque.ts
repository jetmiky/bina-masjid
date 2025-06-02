import type Announcements from "./Announcement";
import type FinanceRecord from "./FinanceRecord";

interface Address {
    street: string;
    city: string;
    province: string;
    zip: string;
}

export default interface Mosque {
    uid: string;
    name: string;
    address: Address;
    phone: string;
    img: string;
    announcements?: Announcements[];
    finances?: FinanceRecord[];
}
