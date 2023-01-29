import { create } from "zustand";

const useAppStore = create((set) => ({
  userIsSignedIn: false,
  setUserIsSignedIn: (userIsSignedIn) =>
    set((state) => ({ userIsSignedIn: userIsSignedIn })),

  currentUser: {
    username: null,
    email: null,
    profilePicURL: null,
    uid: null,
  },
  setCurrentUser: (newUser) => set((state) => ({ currentUser: newUser })),

  googleUser: null,
  setGoogleUser: (googleUser) => set((state) => ({ googleUser: googleUser })),
}));

export default useAppStore;
