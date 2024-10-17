import React from "react";
import "./styles.scss";
import { useSelector } from "react-redux";
import Sheet from "./Sheet";
import Selection from "./Selection";

const Main = () => {
  const clickedOU = useSelector((state) => state.outree.clickedOU);

  const programList = useSelector((state) => state.metadata.programList);
  const programId = useSelector((state) => state.main.programId);
  const status = useSelector((state) => state.main.status);
  const transferStatus = useSelector((state) => state.main.transferStatus);

  return (
    <div className="ms-2 w-100">
      <div className="my-3">
        <Selection
          clickedOU={clickedOU}
          programList={programList}
          programId={programId}
        />
      </div>
      {status ? (
        <Sheet
          clickedOU={clickedOU}
          programList={programList}
          programId={programId}
          transferStatus = {transferStatus}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Main;
