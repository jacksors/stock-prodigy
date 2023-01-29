import { useState, useRef } from "react";
import { Autocomplete, Loader } from "@mantine/core";
import { UserContext } from "../utils/context";
import { useContext } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { useEffect } from "react";
import Navigation from "../Navigation";
import { Navigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";

export default function AutocompleteLoading() {
  const timeoutRef = useRef(-1);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  const { user: currentUser } = useContext(UserContext);
  const ctx = useContext(UserContext);

  useEffect(() => {
    if (currentUser) {
      let tempFriends = [];
      let tempUsers = [];
      const friendsCollection = collection(
        db,
        "users",
        currentUser?.uid,
        "friends"
      );
      const usersCollection = collection(db, "users");
      getDocs(friendsCollection).then((querySnapshot) => {
        querySnapshot.forEach((doc1) => {
          tempFriends.push(doc1.id);
        });
      });
      setFriends(tempFriends);
      getDocs(usersCollection).then((querySnapshot) => {
        querySnapshot.forEach((doc1) => {
          getDoc(doc(db, "users", doc1.id)).then((doc1) => {
            if (
              doc1.data().id !== currentUser.uid &&
              !friends.includes(doc1.data().id)
            ) {
              let temp = doc1.data();
              temp.uid = doc1.id;
              tempUsers.push(temp);
            }
          });
        });
      });
      setUsers(tempUsers);
    }
  }, [currentUser]);

  const handleChange = (value) => {
    window.clearTimeout(timeoutRef.current);
    setInput(value);
    setData([]);

    if (value.trim().length === 0 || value.includes("@")) {
      setLoading(false);
    } else {
      setLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        setLoading(false);
        let data1 = users.filter((user) =>
          user.username.toLowerCase().includes(value)
        );
        setData(data1.map((user) => `@${user.username}`));
      }, 500);
    }
  };
  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        left: "8rem",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "1rem",
      }}
    >
      <Autocomplete
        value={input}
        data={data ? data : ["No results"]}
        onChange={handleChange}
        rightSection={loading ? <Loader size={16} /> : null}
        label="Search for friends"
        placeholder="Username"
        style={{ marginBottom: 20 }}
      />
      {/*<Select
        options={users.filter(
          (user) => user.username === value.match(/[A-z]+/)[0]
        )}
        getOptionLabel={(option) => option.username}
        getOptionValue={(option) => option.uid}
        onChange={(option) => {
          setValue(option.uid);
        }}
      />*/}
      {input ? (
        users.filter((user) => user.username === input.slice(1)) !== [] ? (
          <Link
            to={`/profile?uid=${
              users.filter((user) => user.username === input.slice(1))[0]?.uid
            }`}
          >
            <Button style={{ marginLeft: 10 }} varient="primary">
              Go to Profile
            </Button>
          </Link>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
}
