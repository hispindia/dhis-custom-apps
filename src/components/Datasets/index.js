import React, { useEffect } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDataset, setStatus } from "../../store/main/main.action";
import Form from 'react-bootstrap/Form';

const DataSets = ({head}) => {
  const dispatch = useDispatch();
  const dataSetList = useSelector((state) => state.main.dataSetList);
  const dataSetId = useSelector((state) => state.main.selectedDataset);

  const handleChange = (ev) => {
    const { value } = ev.target;
    dispatch(setSelectedDataset(value));
  };

  useEffect(() => {
    dispatch(setSelectedDataset(''));
  }, [head])

  return (
    <>
      <div className="dataset-container my-3">
        <label>Data Set</label>
        <Form.Select value={dataSetId} onChange={handleChange}>
          <option className="text-italic" value="">
            --Select Data Set--
          </option>
          {dataSetList.map((ds) => (
              <option
                key={ds.id}
                value={ds.id}
              >
                {ds.name}
              </option>
            ))}
        </Form.Select>
      </div>
    </>
  );
};

export default DataSets;
