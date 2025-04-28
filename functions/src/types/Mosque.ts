import type Announcements from "./Announcement";

export default interface Mosque {
    uid: string;
    address: string;
    phone: string;
    announcements?: Announcements[];
}
