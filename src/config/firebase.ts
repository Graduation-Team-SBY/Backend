import * as admin from "firebase-admin";
import * as serviceAccount from "../../service_account.json";
export const firebaseapp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: process.env.FIREBASE_BUCKET as string,
});
export const firebaseStorage = admin.storage();
export const firebaseFirestore = admin.firestore();
