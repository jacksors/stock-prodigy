import { MantineProvider } from "@mantine/core";
import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Modal,
  Button,
} from "react-router-dom";
import Navigation from "./Navigation";
import Home from "./Home";
import News from "./News";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import { auth, db } from "./utils/firebase";
import useAppStore from "./store/useAppStore";
import { googleSignIn } from "./Login";
import {
  setDoc,
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import FriendsList from "./friends/FriendsList";
import Joyride from "react-joyride";
import { steps } from "./tutorial";

import BuySell from "./BuySell";

import { useContext } from "react";
import { UserContext } from "./utils/context";
import { useUserData } from "./utils/hooks";
import { fetchStockLive } from "./stock";

function App() {
  const [stock, setStock] = useState("");
  const [stockHistory, setStockHistory] = useState([]);
  const [stockLive, setStockLive] = useState({});
  const [signedIn, setSignedIn] = useState(false);
  const [show, setShow] = useState(false);
  const [networth, setNetworth] = useState(0);
  const [cash, setCash] = useState(0);
  const [tutorial, setTutorial] = useState(false);
  const [portfolio, setPortfolio] = useState([]);

  const toggleTutorial = () => {
    setTutorial(!tutorial);
  };

  const SubmitNewProfile = async (username) => {
    const calculateNetWorth = async () => {
      let sum = 0;
      portfolio.forEach(async (stock) => {
        fetchStockLive(stock.id).then((stockres) => {
          let price = stockres["Global Quote"]["05. price"];
          sum += price * stock.quantity;

          setNetworth(sum + cash);
        });
      });
    };

    useEffect(() => {
      calculateNetWorth();
    }, [portfolio]);

    const getPortfolio = async () => {
      const querySnapshot = await getDocs(
        collection(db, "users", auth.currentUser?.uid, "portfolio")
      );
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const data = doc.data();
        data.id = doc.id;
        setPortfolio((portfolio) => [...portfolio, data]);
        // if (portfolio.length > 9) {
        //   }
      });
    };

    useEffect(() => {
      getPortfolio();
    }, [signedIn]);

    setDoc(doc(db, "users", useAppStore.getState().googleUser.uid), {
      username: username,
      email: useAppStore.getState().googleUser.email,
      profilePicURL: `https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${username}`,
      cash: 1000,
    })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  auth.onAuthStateChanged((user) => {
    if (user && !signedIn) {
      const docRef = doc(db, "users", auth.currentUser.uid);
      getDoc(docRef).then((docSnap) => {
        if (!docSnap.exists()) {
          SubmitNewProfile(username);
        }
      });

      const docRef1 = doc(db, "users", auth.currentUser.uid);
      getDoc(docRef1).then((docSnap) => {
        setCash(docSnap.data().cash);
        setTimeout(() => {}, 1000);
        let q;
        if (auth.currentUser) {
          q = collection(db, "users", auth.currentUser.uid, "portfolio");
        }
        let portfolio = [];
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const data = doc.data();
            data.id = doc.id;
            portfolio.push(data);
          });
          let networthtemp = 0;

          portfolio.forEach((data) => {
            networthtemp += data.dca * parseFloat(data.quantity);
          });

          setNetworth(networthtemp.toFixed(2));
        });
      });

      const username = user.email.match(/^([^@]*)@/)[1];
      useAppStore.setState({ userIsSignedIn: true });
      setSignedIn(true);
      useAppStore.setState({ googleUser: user });
      useAppStore.setState({
        currentUser: {
          username: username,
          email: user.email,
          profilePicURL: `https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${username}`,
          uid: user.uid,
        },
      });
    } else {
      useAppStore.setState({ userIsSignedIn: false });
    }
  });

  useEffect(() => {
    setTutorial(localStorage.getItem("tutorial") === "true" ? true : false);
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const userData = useUserData();

  return (
    <MantineProvider>
      <UserContext.Provider value={userData}>
        <Router>
          <div className="App">
            <Joyride
              run={tutorial}
              steps={steps}
              continuous={true}
              disableOverlay={true}
              disableCloseOnEsc={true}
              disableOverlayClose={true}
              hideCloseButton={true}
              styles={{
                options: {
                  // modal arrow and background color
                  arrowColor: "#eee",
                  backgroundColor: "#eee",
                  // page overlay color
                  overlayColor: "rgba(79, 26, 0, 0.4)",
                  //button color
                  primaryColor: "#4781de",
                  //text color
                  textColor: "#333",

                  //width of modal
                  width: 500,
                  //zindex of modal
                  zIndex: 1000,
                },
              }}
            />
            <Navigation signedIn={signedIn} setSignedIn={setSignedIn} />
            <header className="App-header" style={{ paddingTop: "70px" }}>
              <Routes>
                <Route
                  path="/buysell"
                  element={
                    <BuySell
                      stock={stock}
                      setStockHistory={setStockHistory}
                      stockHistory={stockHistory}
                      setStock={setStock}
                      stockLive={stockLive}
                      setStockLive={setStockLive}
                      cash={cash}
                      setCash={setCash}
                      networth={networth}
                      setNetworth={setNetworth}
                      tutorial={tutorial}
                    />
                  }
                />
                <Route
                  path="/"
                  element={
                    <Home
                      networth={networth}
                      cash={cash}
                      setTutorial={toggleTutorial}
                    />
                  }
                />
                <Route path="news" element={<News />} />
                <Route path="profile" element={<Profile />} />
                <Route path="editprofile" element={<EditProfile />} />
                <Route path="friends" element={<FriendsList />} />
              </Routes>
            </header>
          </div>
        </Router>
      </UserContext.Provider>
    </MantineProvider>
  );
}

export default App;
