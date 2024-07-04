import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDataset } from "../../store/main/main.action";
const DataSetTree = () => {
  const dispatch = useDispatch();
  const dataSets = useSelector((state) => state.main.dataSetList);
  const SelectedRoute = useSelector((state) => state.sidebar?.Title?.text);
  const [showvalue, setShowvalue] = useState();
  const [formData, setFormData] = useState(null);
  const SidebarTitle = useSelector((state) => state.sidebar.Title);
  const handleChange = (ev) => {
    const { value } = ev.target;
    console.log('onChnage clicked in Dataset tree index..........................................')
    const selectedValue = JSON.parse(value);
    setFormData(selectedValue)
    setShowvalue(value.name);
    if (value) {
      const filteredDataSet = dataSets?.filter(
        (ds) => ds?.id === selectedValue.id
      );

      if (filteredDataSet?.length) {
        dispatch(setSelectedDataset(filteredDataSet));
      }
    }
  };

  useEffect(() => {
    dispatch(setSelectedDataset([]));
    setFormData(null);
  }, [SelectedRoute])
  return (
    <>
      <h3 style={{ marginLeft: '15px', fontWeight: 'bold', textAlign: 'center' }}>{SidebarTitle?.text}</h3>
      <div className="dataset-container">

        <label htmlFor="data-set-select">Data Set</label>
        <select className="form-select" onChange={(e) => handleChange(e)}>
          <option className="text-italic" val="">
            --Select Data Set--
          </option>
          {dataSets?.length > 0 &&
            dataSets?.map((ds) => (
              <option
                selected={formData?.id == ds.id}
                key={ds.id}
                value={JSON.stringify({ id: ds.id, name: ds.name })}
              >
                {ds?.name || showvalue}
              </option>
            ))}
        </select>
      </div>
    </>
  );
};

export default DataSetTree;
