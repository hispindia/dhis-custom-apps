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
          <option selected={periodType == 'Yearly'} value="Yearly">Yearly</option>
          <option selected={periodType == 'Monthly'} value="Monthly">Monthly</option>
          <option selected={periodType == 'Six Monthly April'} value="Six Monthly April">Six Monthly April</option>
          <option selected={periodType == 'Financial April'} value="Financial April">Financial April</option>

        </select>
      </div>
      {periodType && (
        <DisplayPeriod
          periodType={periodType}
          setMonth={setMonth}
          handleChange={handleChange}
          formData={formData}
          formMonth={formMonth}
          setFinancialApril={setFinancialApril}
        />
      )}
    </div>
  );
};

const DisplayPeriod = ({ periodType, handleChange, setMonth, formData, formMonth ,setFinancialApril}) => {

  if (!periodType) return null;
  const nepaliDate = new NepaliDate()
  const currentYear = nepaliDate.getYear();
  const years = [];

  for (let i = currentYear ; i >= currentYear-5; i--) years.push(i);

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
  } 
  else if (periodType === "Monthly") {
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
  else if (periodType === "Six Monthly April") {
    
  
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
          
          
                <option  value="AprilS1">April-September</option>
                <option  value="AprilS2">October-March</option>
        
        
          </select>
        </div>
      </div>
    );
  }

  else if (periodType === "Financial April") {
    return (
      <div className="col" style={{ width: "100%", display: 'flex', marginTop: '10px' }}>
        <label style={{ marginRight: "10px", fontWeight: "bold", width: "12%" }}>
          Period
        </label>
        <select
          className="form-select"
          onChange={(e) => {

         
            handleChange(e, "yyyyApril");
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
  } 
  
   else {
    return null;
  }
};

export default Period;

