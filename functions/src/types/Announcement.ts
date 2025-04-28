import type Mosque from "./Mosque";

export default interface Announcements {
    id: string;
    title: string;
    description: string;
    mosque?: Mosque;
}
