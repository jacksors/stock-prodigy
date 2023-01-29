import { auth, db } from "./firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [cash, setCash] = useState(0);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = doc(db, "users", user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
        setCash(doc.data()?.cash);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, cash };
}
