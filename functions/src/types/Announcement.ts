import type { Timestamp } from "firebase-admin/firestore";
import type Mosque from "./Mosque";

export default interface Announcements {
    id: string;
    title: string;
    description: string;
    timestamp: Timestamp;
    mosque?: Mosque;
}
