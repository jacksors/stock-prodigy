import { signOut } from "firebase/auth";
import { auth } from "./utils/firebase";

const SignOutGoogle = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
};

export default SignOutGoogle;
