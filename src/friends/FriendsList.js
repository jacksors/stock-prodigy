import React, { useState } from "react";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import FriendCard from "./FriendCard";
import { useEffect } from "react";
import SearchBar from "./FriendSearchMantine";
import { Container, Row, Col } from "react-bootstrap";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const friendsCollection = collection(
          db,
          "users",
          auth.currentUser.uid,
          "friends"
        );
        const usersCollection = collection(db, "users");
        let tempFriends = [];
        getDocs(friendsCollection).then((querySnapshot) => {
          querySnapshot.forEach((doc1) => {
            getDoc(doc(db, "users", doc1.id)).then((doc1) => {
              tempFriends.push(doc1.data());
            });
          });
          setFriends(tempFriends);
        });
        let tempUsers = [];
        getDocs(usersCollection).then((querySnapshot) => {
          querySnapshot.forEach((doc1) => {
            getDoc(doc(db, "users", doc1.id)).then((doc1) => {
              tempUsers.push(doc1.data());
            });
          });
          setUsers(tempUsers);
        });
      }
    });
  }, [auth]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "25%",
          backgroundColor: "grey",
          top: "0",
        }}
      >
        <SearchBar data={users} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          width: "75%",
          height: "80vh",
          overflow: "scroll",
          marginBottom: "100px",
        }}
      >
        <Container>
          <Row>
            {friends.map((friend) => (
              <>
                <a
                  style={{
                    display: "block",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    textDecoration: "none",
                    width: "100%",
                  }}
                  href={`/profile?uid=${
                    users.filter((user) => user.username === friend.username)[0]
                      ?.uid
                  }`}
                >
                  <Col md={4} style={{ marginBottom: "20px" }}>
                    <FriendCard key={friend.id} friend={friend} />
                  </Col>
                </a>
              </>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default FriendsList;
