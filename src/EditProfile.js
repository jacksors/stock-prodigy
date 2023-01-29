import { Container, Form, Button, Image } from "react-bootstrap";
import { useState } from "react";
import useAppStore from "./store/useAppStore";
import { setDoc } from "firebase/firestore";
import { db } from "./utils/firebase";

const SubmitNewProfile = async (username, firstName, lastName) => {
  useAppStore.getState().setCurrentUser({
    firstname: firstName,
    lastname: lastName,
    username: username,
    email: useAppStore.getState().googleUser.email,
    profilePicURL: `https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${username}`,
  });

  await setDoc(db, "users", useAppStore.getState().googleUser.uid, {
    firstname: firstName,
    lastname: lastName,
    username: username,
    email: useAppStore.getState().googleUser.email,
    profilePicURL: `https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${username}`,
  });
};

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <>
      <Container>
        <h2>Edit Profile</h2>
        <Container style={{ width: "50vw", flexDirection: "column" }}>
          <div style={{ flexDirection: "column" }}>
            <Image src={useAppStore.getState().currentUser.profilePicURL} />
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              style={{
                justifyContent: "center",
                display: "inline",
                alignContent: "center",
                width: "20vw",
                marginLeft: "10px",
              }}
              onChange={(e) => setUsername(e.target.value)}
            ></Form.Control>
          </div>
        </Container>
        <br />
        <br />
        <Form.Label style={{ display: "inline" }}>Email</Form.Label>
        <Form.Control
          type="Email"
          disabled
          placeholder={
            useAppStore.getState().googleUser.email
              ? useAppStore.getState().googleUser.email
              : "Email"
          }
          style={{
            display: "inline",
            width: "20vw",
            marginLeft: "10px",
          }}
        ></Form.Control>
        <br />
        <br />
        <Form.Label style={{ display: "inline" }}>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="First Name"
          style={{
            display: "inline",
            width: "20vw",
            marginLeft: "10px",
          }}
          onChange={(e) => setFirstName(e.target.value)}
        ></Form.Control>
        <br />
        <br />
        <Form.Label style={{ display: "inline" }}>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Last Name"
          style={{
            display: "inline",
            width: "20vw",
            marginLeft: "10px",
          }}
          onChange={(e) => setLastName(e.target.value)}
        ></Form.Control>
        <br />
        <br />
        <Button variant="primary" type="submit" onClick={SubmitNewProfile}>
          Submit
        </Button>
      </Container>
    </>
  );
};

export default EditProfile;
