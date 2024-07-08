import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPeriod } from "../../store/main/main.action";
export const Period = ({ head }) => {
  const dispatch = useDispatch();
  const selectedDataset = useSelector((state) => state.main.selectedDataset);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [periodType, setPeriodType] = useState("");
  const [formData, setFormData] = useState(null);
  const [formMonth, setFormMonth] = useState(null);

  const handleChange = (e, type) => {
    const { value } = e.target;
    setFormData(value)
    // setFormMonth(value)

    if (type === "yyyy") setYear(value);
    if (type === "mm") setMonth(value);
  };

  useEffect(() => {
    if (year) dispatch(setPeriod(year));
    if (month) dispatch(setPeriod(`${year}-${month}`));
  }, [year, month]);

  useEffect(() => {
    setPeriod([]);
    setFormData(null)
    setPeriodType('')
    setFormMonth(null)
  }, [head]);

  if (!selectedDataset) return null;

  return (
    <div className="period-container my-3" >
      <div className="col" style={{ display: 'flex', width: '100%', marginTop: '10px' }}>
        <label style={{ marginRight: "10px", fontWeight: "bold", width: "12%" }}>
          Period Type
        </label>
        <select
          className="form-select"
          onChange={(e) => setPeriodType(e.target.value)}
        >
          <option value="">Select Period Type</option>
          <option selected={periodType == 'Yearly'} value="Yearly">Yearly</option>
          <option selected={periodType == 'Monthly'} value="Monthly">Monthly</option>
        </select>
      </div>
      {periodType && (
        <DisplayPeriod
          periodType={periodType}
          setMonth={setMonth}
          handleChange={handleChange}
          formData={formData}
          formMonth={formMonth}
        />
      )}
    </div>
  );
};

const DisplayPeriod = ({ periodType, handleChange, setMonth, formData, formMonth }) => {

  if (!periodType) return null;

  const currentYear = 2082;
  const years = [];
  for (let i = currentYear - 5; i <= currentYear; i++) years.push(i);

  if (periodType === "Yearly") {
    return (
      <div className="col" style={{ width: "100%", display: 'flex', marginTop: '10px' }}>
        <label style={{ marginRight: "10px", fontWeight: "bold", width: "12%" }}>
          Period
        </label>
        <select
          className="form-select"
          onChange={(e) => {

            setMonth("");
            handleChange(e, "yyyy");
          }}
        >
          <option className="text-italic" value="">
            Year
          </option>
          {years.map((year) => (
            <option selected={formMonth == year} key={year} value={year}

            >
              {year}
            </option>
          ))}
        </select>
      </div>
    );
  } else if (periodType === "Monthly") {
    // var months = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec";
    var months = "Baisakh_Jestha_Asadh_Shrawan_Bharda_Ashwin_Kartik_Mansir_Poush_Magh_Falgun_Chaitra";




    months = months.split("_");

    return (
      <div className="row" style={{ marginTop: '10px' }}>
        <label style={{ marginRight: "-5px", fontWeight: "bold", width: "12%" }}>
          Period
        </label>
        <div className="col" style={{ width: "175px" }}>
          <select
            className="form-select"
            onChange={(e) => handleChange(e, "yyyy")}
          >
            <option className="text-italic" value="">
              Year
            </option>
            {years.map((year) => (
              <option selected={formMonth == year} key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="col" style={{ width: "175px" }}>
          <select
            className="form-select"
            onChange={(e) => handleChange(e, "mm")}
          >
            <option className="text-italic" value="">
              Month
            </option>
            {months.map((month, index) => (
              <option
                selected={formData == month}
                key={index} value={`00${index + 1}`.slice(-2)}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Period;

