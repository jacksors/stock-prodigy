import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "./utils/firebase";
import { useState, useEffect } from "react";
import { Image, Container, Row, Col, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import useAppStore from "./store/useAppStore";
import StockCard from "./StockCard";
import { createStyles, Text, Card, RingProgress, Group } from "@mantine/core";
import { StatsRingCard } from "./StatsRingCard";
import { useContext } from "react";
import { UserContext } from "./utils/context";
import { fetchStockLive } from "./stock";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    lineHeight: 1,
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1,
  },

  inner: {
    display: "flex",

    [theme.fn.smallerThan(350)]: {
      flexDirection: "column",
    },
  },

  ring: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",

    [theme.fn.smallerThan(350)]: {
      justifyContent: "center",
      marginTop: theme.spacing.md,
    },
  },
}));

const Profile = () => {
  const { classes, theme } = useStyles();
  const [username, setUsername] = useState("");
  const [cash, setCash] = useState(0);
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [netWorth, setNetWorth] = useState(0);
  const [stockLive, setStockLive] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const uid = searchParams.get("uid");

  const { username: myUsername, user: myUser } = useContext(UserContext);

  auth.onAuthStateChanged((user) => {
    if (user) {
      getProfile();
    }
  });

  const getProfile = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUsername(data.username);
      setCash(data.cash);
      setProfilePicture(data.profilePicURL);
      setEmail(data.email);
    } else {
      console.warn("No such document!");
    }
  };

  const getTransactions = async () => {
    const querySnapshot = await getDocs(
      collection(db, "users", uid, "transactions")
    );
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      doc.data().id = doc.id;
      setTransactions((transactions) => [...transactions, doc.data()]);
    });
  };

  const getAchievements = async () => {
    const querySnapshot = await getDocs(
      collection(db, "users", uid, "achievements")
    );
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let test = doc.data();
      test.id = doc.id;
      setAchievements((achievements) => [...achievements, test]);
    });
  };

  const getPortfolio = async () => {
    const querySnapshot = await getDocs(
      collection(db, "users", uid, "portfolio")
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

  const addFriend = async () => {
    const docRef = doc(db, "users", myUser.uid, "friends", uid);
    await setDoc(docRef, {
      friends: true,
    });
  };

  const calculateNetWorth = async () => {
    let sum = 0;
    portfolio.forEach(async (stock) => {
      fetchStockLive(stock.id).then((stockres) => {
        let price = stockres["Global Quote"]["05. price"];
        sum += price * stock.quantity;

        setNetWorth(sum + cash);
      });
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      getPortfolio();
      getTransactions();
      getAchievements();
    });
  }, [auth]);

  useEffect(() => {
    calculateNetWorth();
  }, [portfolio, cash]);

  const FriendButton = () => {
    let docRef = doc(db, "users", myUser?.uid, "friends", uid);
    let docSnap = getDoc(docRef).then((doc) => {
      if (!docSnap.exists()) {
        return (
          <>
            <Button onClick={addFriend} style={{ marginTop: "10px" }}>
              Add Friend
            </Button>
          </>
        );
      } else {
        return (
          <>
            <Button style={{ marginTop: "10px" }}>Remove Friend</Button>
          </>
        );
      }
    });
    return <></>;
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "27px",
          paddingBottom: "30px",
        }}
      >
        <div
          style={{
            width: "23vw",
            height: "80vh",
            backgroundColor: "#212936",
            padding: "30px",
            paddingTop: "50px",
            paddingRight: "30px",
            overflow: "scroll",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "30px",
            }}
          >
            <Image
              src={profilePicture}
              style={{
                borderRadius: "100%",
                width: "50%",
                marginBottom: "10px",
              }}
            />

            <h2 style={{ marginBottom: "10px" }}>
              {username !== "" ? "@" : ""}
              {username}
            </h2>
            {myUser !== null ? (
              myUser?.uid !== uid ? (
                <FriendButton />
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </div>
          <h5 style={{ marginBottom: "15px" }}>Cash: ${cash.toFixed(2)}</h5>
          <h5 style={{ marginBottom: "30px" }}>
            Net Worth: ${netWorth.toFixed(2)}
          </h5>
          {achievements.map((achievement) => (
            <>
              {/* <StatsRingCard title={achievement.id} completed={5} total={6} />
              <br></br> */}
              {achievement.id === "research" ? (
                <Image
                  src="/Research.png"
                  width={"50%"}
                  style={{ margin: "10px" }}
                />
              ) : (
                <></>
              )}
              {achievement.id === "diverse" ? (
                <Image
                  src="/DiversifiedPortfolio.png"
                  width={"50%"}
                  style={{ margin: "10px" }}
                />
              ) : (
                <></>
              )}
            </>
          ))}
        </div>
        <div
          style={{
            width: "50vw",
            height: "80vh",
            backgroundColor: "#212936",
          }}
        >
          <Container
            fluid
            style={{
              width: "100%",
              padding: "30px",
              paddingRight: "30px",
              paddingLeft: "5px",
              overflow: "scroll",
              height: "100%",
            }}
          >
            <Row>
              {portfolio.map((stock) => (
                <Col xs={6}>
                  <StockCard stock={stock} />
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Profile;
