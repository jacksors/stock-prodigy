import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth, provider } from "./utils/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import useAppStore from "./store/useAppStore";
// import { Button } from "react-bootstrap";

export const googleSignIn = async () => {
  const signInResult = await signInWithRedirect(auth, provider);

  const result = await getRedirectResult(auth);
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const token = result.credential.accessToken;
    // set token in local storage
    sessionStorage.setItem("Auth Token", token);
    sessionStorage.setItem("User", JSON.stringify(result.user));
  }
};

// const Login = () => {
//   return (
//     <div>
//       <Button onClick={googleSignIn}>Sign in with Google</Button>
//     </div>
//   );
// };
