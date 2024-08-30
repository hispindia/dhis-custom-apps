import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPeriod } from "../../store/main/main.action";
import NepaliDate from 'nepali-datetime'
export const Period = ({ head }) => {
  const dispatch = useDispatch();
  const selectedDataset = useSelector((state) => state.main.selectedDataset);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [financialApril,setFinancialApril] = useState("");
  const [sixmonthly, setSixMonthly] = useState("");
  
  const [periodType, setPeriodType] = useState("");
  const [formData, setFormData] = useState(null);
  const [formMonth, setFormMonth] = useState(null);
  const handleChange = (e, type) => {
    const { value } = e.target;
    setFormData(value)
    // setFormMonth(value)
console.log("type===========",type)
    if (type === "yyyy") setYear(value);
    else{
      setMonth("");
      setSixMonthly("");
      setFinancialApril("");
      
    }
    if (type === "mm") setMonth(value);
    if(type ==="yyyyApril")setFinancialApril(`${value}April`);
    if(type ==="sixmonthly")setSixMonthly(value)
  };

  useEffect(() => {
    if (year) dispatch(setPeriod(year));
    if (month) dispatch(setPeriod(`${year}-${month}`));
    if(financialApril)dispatch(setPeriod(financialApril));
    if(sixmonthly)dispatch(setPeriod(`${year}${sixmonthly}`));

    
  }, [year, month,financialApril,sixmonthly]);

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
          <option selected={periodType == 'yearly'} value="yearly">Yearly</option>
          <option selected={periodType == 'monthly'} value="monthly">Monthly</option>
          <option selected={periodType == 'six-monthly-shrawan'} value="six-monthly-shrawan">Six Monthly Shrawan</option>
          <option selected={periodType == 'financial-shrawan'} value="financial-shrawan">Financial Shrawan</option>

        </select>
      </div>
      {periodType && (
        <DisplayPeriod
          periodType={periodType}
          year={year}
          handleChange={handleChange}
          formData={formData}
          formMonth={formMonth}
        />
      )}
    </div>
  );
};

const DisplayPeriod = ({ periodType, handleChange, year, formData, formMonth}) => {

  if (!periodType) return null;
  const nepaliDate = new NepaliDate()
  const currentYear = nepaliDate.getYear();
  const years = [];

  for (let i = currentYear ; i >= currentYear-5; i--) years.push(i);

  if (periodType === "yearly") {
    return (
      <div className="col" style={{ width: "100%", display: 'flex', marginTop: '10px' }}>
        <label style={{ marginRight: "10px", fontWeight: "bold", width: "12%" }}>
          Period
        </label>
        <select
          className="form-select"
          onChange={(e) => {
            handleChange(e, "yyyy");
          }}
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
    );
  } 
  else if (periodType === "monthly") {
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
  }
  else if (periodType === "six-monthly-shrawan") {
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

            onChange={(e) => handleChange(e, "sixmonthly")}
          >
            <option className="text-italic" value="">
              Six Monthly
            </option>
          {year ?
            <>
            <option  value="AprilS1">Shrawan-Poush {year}</option>
            <option  value="AprilS2">Magh-Asar {Number(year)+1}</option>
            </>: ''}
          </select>
        </div>
      </div>
    );
  }

  else if (periodType === "financial-shrawan") {
    return (
      <div className="col" style={{ width: "100%", display: 'flex', marginTop: '10px' }}>
        <label style={{ marginRight: "10px", fontWeight: "bold", width: "12%" }}>
          Period
        </label>
        <select
          className="form-select"
          onChange={(e) => {
            handleChange(e, "yyyyApril");
          }}>
          <option className="text-italic" value="">
            Financial
          </option>
          {years.map((year) => (
            <option selected={formMonth == year} key={year} value={year}

            >
              Shrawan {year-1} - Ashadh {year}
            </option>
          ))}
        </select>
      </div>
    );
  } 
  
   else {
    return null;
  }
};

export default Period;

