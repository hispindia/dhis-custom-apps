import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  setStatus,
  setProgramId,
  setTransferStatus,
} from "../../store/main/main.action";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const Selection = ({
  clickedOU,
  programList, 
  programId,
}) => {
  const dispatch = useDispatch();

  const handleProgram = (e) =>  {
    const {value} = e.target;
    dispatch(setProgramId(value))
  }
  const handleTransfer = (e) => {
    const {value} = e.target;
    dispatch(setTransferStatus(value))
  }
  return (
    <>
      {clickedOU && clickedOU.level != 5 && clickedOU.level != 6 ? (
        <Row>
          <Col md={3} lg={1} className="py-3">
            Program:{" "}
          </Col>
          <Col md={9} lg={5} className="py-3">
            <Form.Select
            value={programId} 
            onChange={handleProgram}
            >
              {programList.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} lg={1} className="py-3">
            Referred:{" "}
          </Col>
          <Col md={9} lg={5} className="py-3">
            <Form.Select
            onChange={handleTransfer}
            >
            <option value={'transfer-in'}>
              Transferred In
            </option>
            <option value={'transfer-out'}>
              Transferred Out
            </option>
            </Form.Select>
          </Col>
        </Row>
      ) : (
        ""
      )}

      <div className="text-center">
        <button
          type="button"
          className={"btn btn-md"}
          style={{    
            borderColor: "rgb(13, 71, 161)",
            background: "linear-gradient(rgb(21, 101, 192) 0%, rgb(6, 80, 163) 100%) rgb(43, 97, 179)",
            color: "rgb(255, 255, 255)",
            fill: "rgb(255, 255, 255)",
            fontWeight: "500"
          }}
          onClick={() => dispatch(setStatus(true))}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default Selection;
