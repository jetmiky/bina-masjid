import {
    getFirestore,
    type FirestoreDataConverter,
    type CollectionReference,
    type DocumentData,
    type PartialWithFieldValue,
} from "firebase-admin/firestore";

import type Mosque from "../types/Mosque";
import type Announcement from "../types/Announcement";
import type FinanceRecord from "../types/FinanceRecord";

/**
 * Firestore types converter.
 *
 * @return {FirestoreDataConverter} Firestore collection.
 */
const converter = <T>(): FirestoreDataConverter<T> => ({
    toFirestore: (data: PartialWithFieldValue<T>) => data as DocumentData,
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as T,
});

/**
 * Generator for firestore collection.
 *
 * @param {string} path Collection path.
 * @return {CollectionReference<T>} Firestore collection.
 */
const getRootCollection = <T>(path: string): CollectionReference<T> =>
    getFirestore().collection(path).withConverter(converter<T>());

/**
 * Generator for firestore collection.
 *
 * @param {string} name Collection path.
 * @return {function(mosqueId: string): CollectionReference<T>} Firestore collection.
 */
const getSubCollection =
    <T>(name: string): ((mosqueId: string) => CollectionReference<T>) =>
    (mosqueId: string): CollectionReference<T> =>
        getFirestore()
            .collection("mosques")
            .doc(mosqueId)
            .collection(name)
            .withConverter(converter<T>());

const db = {
    firestore: getFirestore,
    mosques: () => getRootCollection<Mosque>("mosques"),
    announcements: getSubCollection<Announcement>("announcements"),
    finances: getSubCollection<FinanceRecord>("finance_records"),
};

export default db;
