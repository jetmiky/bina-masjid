import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const app = initializeApp({
    apiKey: "AIzaSyCQCUV9OicqQMeZQUKtcHozy5S-j4cxWrE",
    authDomain: "bina-masjid-digital.firebaseapp.com",
    projectId: "bina-masjid-digital",
    storageBucket: "bina-masjid-digital.firebasestorage.app",
    messagingSenderId: "457727863780",
    appId: "1:457727863780:web:af8b335fed0c4d3e09f5f1",
    measurementId: "G-77QE62NQLV",
});

export const auth = getAuth(app);

if (process.env.FUNCTIONS_EMULATOR) {
    connectAuthEmulator(auth, "http://localhost:9099");
}
