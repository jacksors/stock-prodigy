import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./utils/firebase";

const GetCash = async () => {
  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.cash;
  } else {
    console.warn("No such document!");
  }
};
