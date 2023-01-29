import fetchStock from "./stock";
import fetchStockLive from "./stockLive";
import "./App.css";
import LoadingIcons from "react-loading-icons";
import { useState, useEffect } from "react";
import {
  ButtonGroup,
  ToggleButton,
  Form,
  Button,
  Image,
  Modal,
} from "react-bootstrap";
import StockChart from "./StockChart";
import Select from "react-select";
import nasdaqimport from "./nasdaqStocks";
import nyseimport from "./nyseStocks";
import etf from "./etfStocks";
import Joyride from "react-joyride";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./utils/firebase";
import { steps } from "./tutorial.js";

const nyse = nyseimport.map((stock) => {
  return {
    value: stock["ACT Symbol"],
    label: stock["ACT Symbol"] + " - " + stock["Company Name"],
  };
});
const nasdaq = nasdaqimport.map((stock) => {
  return {
    value: stock.Symbol,
    label: stock.Symbol + " - " + stock["Company Name"],
  };
});

const stocks = [...nyse, ...nasdaq];

const etfs = etf.map((stock) => {
  return {
    value: stock.Symbol,
    label: stock.Symbol + " - " + stock["Company Name"],
  };
});

const BuySell = (props) => {
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("candlestick");
  const [exchange, setExchange] = useState("stocks");
  const [options, setOptions] = useState(stocks);
  const [operation, setOperation] = useState("buy");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [ownedQuantity, setOwnedQuantity] = useState(0);
  const [researchAchieved, setResearchAchieved] = useState(false);

  const SellStock = async () => {
    // Call from buy/sell button, stores the purchas in the database. Not a react component.
    addDoc(collection(db, "users", auth.currentUser.uid, "transactions"), {
      symbol: props.stock,
      type: "sell",
      price: price,
      quantity: quantity,
      date: Timestamp.now(),
    })
      .then()
      .catch((e) => console.log(e));

    let docRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "portfolio",
      props.stock
    );
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const newQuantity = data.quantity - quantity;
      const dca = (data.dca * data.quantity - price * quantity) / newQuantity;
      if (newQuantity > 0) {
        await updateDoc(docRef, { quantity: newQuantity, dca: dca });
      } else {
        await deleteDoc(docRef);
      }
    }

    docRef = doc(db, "users", auth.currentUser.uid);
    docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const newBalance = data.cash + price * quantity;
      await updateDoc(docRef, { cash: newBalance });
    } else {
      console.warn("No such document!");
    }
  };

  const BuyStock = async () => {
    // Call from buy/sell button, stores the purchas in the database. Not a react component.
    addDoc(collection(db, "users", auth.currentUser.uid, "transactions"), {
      symbol: props.stock,
      type: "buy",
      price: price,
      quantity: quantity,
      date: Timestamp.now(),
    })
      .then()
      .catch((e) => console.log(e));

    let docRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "portfolio",
      props.stock
    );

    let docRef1 = doc(
      db,
      "users",
      auth.currentUser.uid,
      "research",
      props.stock
    );

    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      let newQuantity = parseInt(data.quantity) + parseInt(quantity);
      newQuantity = parseInt(String(newQuantity));
      const dca = (data.dca * data.quantity + price * quantity) / newQuantity;
      await updateDoc(docRef, { quantity: newQuantity, dca: dca });
      let docSnap1 = await getDoc(docRef1);
      if (docSnap1.exists()) {
        let docRef2 = doc(
          db,
          "users",
          auth.currentUser.uid,
          "achievements",
          "research"
        );
        let docSnap2 = await getDoc(docRef2);
        if (docSnap2.data()?.achieved) {
        } else {
          await setDoc(docRef2, { achieved: true });
          setResearchAchieved(true);
        }
      }
    } else {
      const dca = price * quantity;
      await setDoc(docRef, { quantity: quantity, dca: dca });
    }

    docRef = doc(db, "users", auth.currentUser.uid);
    docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const newBalance = data.cash - price * quantity;
      await updateDoc(docRef, { cash: newBalance });
    } else {
      console.warn("No such document!");
    }
  };

  const changeExchange = () => {
    if (exchange === "etfs") {
      setExchange("stocks");
      setOptions(stocks);
    } else {
      setExchange("etfs");
      setOptions(etfs);
    }
  };

  useEffect(() => {
    if (props.stockHistory) {
      if (props.stockHistory.length > 0) {
        setLoading(false);
      }
    }
  }, [props.stockHistory]);

  useEffect(() => {
    if (props.stockLive) {
      setPrice(
        (
          parseInt(props.stockLive.MarketCapitalization) /
          parseInt(props.stockLive.SharesOutstanding)
        ).toFixed(2)
      );
    }
  }, [props.stockLive]);

  useEffect(() => {
    if (props.tutorial) {
      props.setStock("AAPL");
      fetchStock("AAPL", props.setStockHistory);
      fetchStockLive("AAPL", props.setStockLive);
    }
  }, []);

  const disableResearch = () => {
    setResearchAchieved(false);
  };

  return (
    <div className="BuySell">
      {researchAchieved ? (
        <div
          className="modal show"
          style={{
            display: "block",
            position: "absolute",
            zIndex: "99999",
            top: "8%",
            color: "black",
          }}
        >
          <Modal.Dialog>
            <Modal.Header closeButton onClick={disableResearch}>
              <Modal.Title>You're a Rambunctious Researcher</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Image src="/Research.png" width={"50%"} />
              <p>
                Doing research before buying and stock is one of the most
                important things you can do!
              </p>
            </Modal.Body>
          </Modal.Dialog>
        </div>
      ) : (
        <> </>
      )}
      {localStorage.getItem("tutorial") === "true" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
          className="step2"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="https://api.dicebear.com/5.x/bottts-neutral/svg?seed=john"
              style={{ width: "5vw" }}
            />
            <h5>John</h5>
          </div>
          <div style={{ width: "15px" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="https://api.dicebear.com/5.x/bottts-neutral/svg?seed=annie"
              style={{ width: "5vw" }}
            />
            <h5>Annie</h5>
          </div>
          <div style={{ width: "15px" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="https://api.dicebear.com/5.x/bottts-neutral/svg?seed=jennifer"
              style={{ width: "5vw" }}
            />
            <h5>Jennifer</h5>
          </div>
          <div style={{ width: "15px" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="https://api.dicebear.com/5.x/bottts-neutral/svg?seed=james"
              style={{ width: "5vw" }}
            />
            <h5>James</h5>
          </div>
        </div>
      ) : (
        <> </>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {window.innerWidth > 720 ? (
          <ButtonGroup
            aria-label="Basic example"
            style={{ position: "flex-start" }}
          >
            <ToggleButton
              variant="secondary"
              type="checkbox"
              defaultChecked="true"
              checked={exchange === "stocks"}
              style={{
                width: "8vw",
                minWidth: "50px",
                textAlign: "center",
              }}
              onClick={changeExchange}
            >
              Stocks
            </ToggleButton>
            <ToggleButton
              variant="secondary"
              type="checkbox"
              defaultChecked="false"
              checked={exchange === "etfs"}
              style={{
                width: "8vw",
                minWidth: "50px",
                textAlign: "center",
              }}
              onClick={changeExchange}
            >
              ETFs
            </ToggleButton>
          </ButtonGroup>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ToggleButton
              variant="secondary"
              type="checkbox"
              defaultChecked="true"
              checked={exchange === "stocks"}
              style={{
                width: "20vw",
                textAlign: "center",
              }}
              onClick={changeExchange}
            >
              NASDAQ
            </ToggleButton>
            <ToggleButton
              variant="secondary"
              type="checkbox"
              defaultChecked="false"
              checked={exchange === "ETFs"}
              style={{
                width: "20vw",
                textAlign: "center",
              }}
              onClick={changeExchange}
            >
              S&P 500
            </ToggleButton>
          </div>
        )}

        <div
          style={{
            width: "30vw",
            color: "black",
            minWidth: "240px",
            marginLeft: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Select
            options={options}
            placeholder={
              localStorage.getItem("tutorial") === true
                ? "AAPL"
                : "Select a stock"
            }
            className="step5"
            menuPlacement="auto"
            menuPosition="fixed"
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            onChange={(e) => {
              props.setStock(e.value);
              fetchStock(e.value, props.setStockHistory);
              fetchStockLive(e.value, props.setStockLive);
              setLoading(true);

              const docRef = doc(
                db,
                "users",
                auth.currentUser.uid,
                "portfolio",
                e.value
              );
              getDoc(docRef)
                .then((docSnap) => {
                  if (docSnap.exists()) {
                    const data = docSnap.data();
                    setOwnedQuantity(parseInt(data.quantity));
                  } else {
                    setOwnedQuantity(0);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          />
        </div>
      </div>
      {loading ? (
        <LoadingIcons.ThreeDots
          fill="#fff"
          width="3vw"
          style={{ margin: "2vw" }}
        />
      ) : (
        <></>
      )}
      {props.stockHistory ? (
        <>
          {props.stockHistory.length > 0 ? (
            <>
              <div className="chartContainer step3 step4">
                {chartType === "candlestick" ? (
                  <StockChart
                    stockHistory={props.stockHistory}
                    chartType={"candlestick"}
                  />
                ) : (
                  <StockChart
                    stockHistory={props.stockHistory}
                    chartType={"line"}
                  />
                )}
                {/* <ButtonGroup aria-label="Basic example">
								<Button
									variant="secondary"
									style={{
										width: '8vw',
										minWidth: '50px',
										textAlign: 'center',
									}}
									onClick={() => setChartType('line')}
								>
									{' '}
									Line{' '}
								</Button>
								<Button
									variant="secondary"
									style={{
										width: '8vw',
										minWidth: '50px',
										textAlign: 'center',
									}}
									onClick={() => setChartType('candlestick')}
								>
									{' '}
									Candlestick{' '}
								</Button>
							</ButtonGroup> */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "10vw",
                    marginLeft: "10px",
                  }}
                >
                  {price ? (
                    <p className="step6 step7">
                      Current Price: {"$"}
                      {price} per Share
                    </p>
                  ) : (
                    <> </>
                  )}
                  <hr style={{ margin: "0", marginBottom: "5px" }} />
                  {props.stockLive.SharesOutstanding ? (
                    <p className="step8">
                      Shares: {props.stockLive.SharesOutstanding}
                    </p>
                  ) : (
                    <> </>
                  )}
                  <hr style={{ margin: "0", marginBottom: "5px" }} />
                  {props.stockLive.MarketCapitalization ? (
                    <p className="step9">
                      Market Cap: ${props.stockLive.MarketCapitalization}
                    </p>
                  ) : (
                    <> </>
                  )}
                  <hr style={{ margin: "0", marginBottom: "5px" }} />
                  {props.stockLive.PERatio ? (
                    <p className="step10">
                      Price per Earning: {props.stockLive.PERatio}x
                    </p>
                  ) : (
                    <> </>
                  )}
                  <hr style={{ margin: "0", marginBottom: "5px" }} />
                  {props.stockLive.DividendYield ? (
                    <p className="step11">
                      Dividend Yield:{" "}
                      {(props.stockLive.DividendYield * 100).toFixed(2)}
                      {"%"}
                    </p>
                  ) : (
                    <> </>
                  )}
                </div>
              </div>
              <div
                style={{
                  flex: "display",
                  flexDirection: "row",
                  width: "50vw",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ButtonGroup style={{ marginBottom: "6px" }}>
                  <ToggleButton
                    variant="secondary"
                    type="checkbox"
                    defaultChecked="true"
                    checked={operation === "buy"}
                    style={{
                      width: "8vw",
                      minWidth: "50px",
                      textAlign: "center",
                    }}
                    onClick={() => setOperation("buy")}
                  >
                    Buy
                  </ToggleButton>
                  <ToggleButton
                    variant="secondary"
                    type="checkbox"
                    defaultChecked="false"
                    checked={operation === "sell"}
                    style={{
                      width: "8vw",
                      minWidth: "50px",
                      textAlign: "center",
                    }}
                    onClick={() => setOperation("sell")}
                  >
                    Sell
                  </ToggleButton>
                </ButtonGroup>
                <Form.Control
                  type="number"
                  id="inputQuantity"
                  className="step12"
                  placeholder="Enter number of shares"
                  style={{
                    display: "inline",
                    width: "20vw",
                    marginLeft: "10px",
                  }}
                  onChange={(e) => setQuantity(e.target.value)}
                ></Form.Control>
                <Button
                  variant={
                    operation === "buy"
                      ? quantity * price <= props.cash
                        ? "success"
                        : "danger"
                      : quantity <= ownedQuantity
                      ? "success"
                      : "danger"
                  }
                  style={{
                    color: "white",

                    display: "inline",
                    width: "auto",
                    textAlign: "center",
                    marginLeft: "10px",
                    marginBottom: "6px",
                  }}
                  onClick={() => {
                    if (operation === "buy" && quantity * price <= props.cash) {
                      BuyStock();
                      setOwnedQuantity(
                        parseInt(String(ownedQuantity)) +
                          parseInt(String(quantity))
                      );
                      setQuantity(0);
                      props.setCash(props.cash - quantity * price);
                    } else if (
                      operation === "sell" &&
                      quantity <= ownedQuantity
                    ) {
                      SellStock();
                      setOwnedQuantity(ownedQuantity - quantity);
                      setQuantity(0);
                      props.setCash(props.cash + quantity * price);
                      document.getElementById("inputQuantity").value = "";
                    }
                  }}
                >
                  {operation === "buy" ? "Buy" : "Sell"}
                </Button>
              </div>
              <p style={{ marginTop: "3px" }}>
                Cash: ${props.cash.toFixed(2)} | Total Price{" "}
                {operation === "buy" ? "Bought" : "Sold"}: $
                {(quantity * price).toFixed(2)} | Total Shares Owned:{" "}
                {ownedQuantity}
              </p>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BuySell;
