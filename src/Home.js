import { useContext, useEffect } from "react";
import { UserContext } from "./utils/context";
import { Form } from "react-bootstrap";
import { useState } from "react";

const Home = (props) => {
  const { user: currentUser } = useContext(UserContext);
  const [switchState, setSwitchState] = useState(false);
  const [netWorth, setNetWorth] = useState(props.cash);

  useEffect(() => {
    setNetWorth(
      (
        parseFloat(String(props.cash)) + parseFloat(String(props.networth))
      ).toFixed(2)
    );
  }, [props.cash, props.networth]);

  return (
    <>
      <h1>Welcome to Stock Prodigy!</h1>
      {currentUser ? (
        props.networth !== NaN &&
        props.cash !== NaN &&
        props.networth + props.cash !== NaN ? (
          <h2>Net worth: ${netWorth}</h2>
        ) : (
          <> </>
        )
      ) : (
        <h2>Please sign in</h2>
      )}
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Tutorial Mode"
        isValid={switchState}
        onChange={(e) => {
          localStorage.setItem("tutorial", e.target.checked);
        }}
      />
    </>
  );
};

export default Home;
