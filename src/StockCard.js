import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";

const StockCard = ({ stock }) => {
  return (
    <Card style={{ width: "18rem", margin: "20px", color: "black" }}>
      <Card.Body>
        <Card.Title style={{ fontSize: "24px", marginBottom: "15px" }}>
          <Badge variant="secondary">{stock.id}</Badge>
        </Card.Title>
        <Card.Text>
          <Row
            style={{ justifyContent: "space-between", marginBottom: "-10px" }}
          >
            <Col style={{ alignItems: "center" }}>
              <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                Quantity Owned:
              </p>
            </Col>
            <Col style={{ alignItems: "center" }}>
              <p style={{ fontSize: "13px" }}>{stock.quantity} Shares</p>
            </Col>
          </Row>
          <Row>
            <Col style={{ alignItems: "center" }}>
              <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                Average Price:
              </p>
            </Col>
            <Col style={{ alignItems: "center" }}>
              <p style={{ fontSize: "13px" }}>${stock.dca.toFixed(2)}</p>
            </Col>
          </Row>
          <Row>
            <Col style={{ alignItems: "center" }}>
              <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                Total Value:
              </p>
            </Col>
            <Col style={{ alignItems: "center" }}>
              <p style={{ fontSize: "13px" }}>
                ${(parseFloat(stock.dca) * parseInt(stock.quantity)).toFixed(2)}
              </p>
            </Col>
          </Row>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default StockCard;
