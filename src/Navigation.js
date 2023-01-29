import React from "react";
import { Navbar, Nav, Container, Image, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { googleSignIn } from "./Login";
import useAppStore from "./store/useAppStore";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import SignOutGoogle from "./Logout";
import { auth } from "./utils/firebase";

const Navigation = (props) => {
  return (
    <>
      <Navbar
        collapseOnSelect
        fixed="top"
        expand="sm"
        variant="dark"
        style={{ padding: "2vh", backgroundColor: "#1f2937" }}
      >
        <Container>
          <Image
            src={require("./logo.png")}
            width={"50vw"}
            style={{ paddingRight: "0.75vw" }}
          />
          <Navbar.Brand href="/" className="step1">
            Stock Prodigy
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav style={{ justifyContent: "center" }}>
              <Nav.Link href="/">Home</Nav.Link>
              {props.signedIn && <Nav.Link href="/buysell">Buy/Sell</Nav.Link>}
              <Nav.Link className="step14" href="/news">
                News
              </Nav.Link>
              {props.signedIn && (
                <Nav.Link className="step15" href="/friends">
                  Friends
                </Nav.Link>
              )}
              {props.signedIn && (
                <Nav.Link
                  className="step13"
                  href={"/profile?uid=" + auth.currentUser?.uid}
                >
                  Profile
                </Nav.Link>
              )}
            </Nav>
            <div style={{ width: "100%" }}></div>
            <Nav style={{ marginRight: "0", right: "0" }}>
              {props.signedIn ? (
                <Button
                  onClick={() => {
                    SignOutGoogle();
                    props.setSignedIn(false);
                  }}
                  variant="outline-secondary"
                  style={{
                    color: "white",
                    outline: "none",
                    right: "0",
                    marginRight: "0",
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={googleSignIn}
                  variant="outline-secondary"
                  style={{
                    color: "white",
                    outline: "none",
                    right: "0",
                    marginRight: "0",
                  }}
                >
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
