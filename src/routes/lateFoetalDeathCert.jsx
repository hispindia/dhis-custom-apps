import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";
import { data } from "autoprefixer";
import { useLocation, useParams } from "react-router-dom";



const borderDotted = {
  display: "inline-block",
  borderBottom: "2px dotted blue",
  verticalAlign: "middle",
};
const borderSolid = {
  borderBottom: "2px solid blue",
  width: "100%",
};
const borderGray = {
  borderBottom: "2px solid blue",
  width: "100%",
};

const borderBlack = {
  borderBottom: "2px dotted blue",
  width: "100%"
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '350px',
    marginBottom: '1.5rem',
    color: 'blue'
  },
  section: {
    fontWeight: 'normal',
  },
  line: {
    marginBottom: '0.25rem',
  },
  lineWithTopMarginSmall: {
    marginTop: '0.75rem',
    marginBottom: '0.25rem',
  },
  lineWithTopMarginLarge: {
    marginTop: '1rem',
    marginBottom: '0.25rem',
  },
  dottedLine: {
    display: 'inline-block',
    borderBottom: '2px dotted blue',
    verticalAlign: 'middle',
    marginLeft: '5px',
  },
  smallWidth: {
    width: '31%',
  },
  mediumWidth: {
    width: '6rem',
  },
  largeWidth: {
    width: '8rem',
  },
  dateBox: {
    display: 'inline-block',
    width: '0.75rem',
    borderBottom: '2px dotted blue',
    marginLeft: '5px',
    verticalAlign: 'middle',
  },
  rightSection: {
    marginTop: '2.5rem',
  },
};

const LateFoetalDeathCert = ({orgUnit, orgUnits, dataElements}) => {
  // const {eventId} = useParams();
  const { state } = useLocation();
  const [certificate, setCertificate] = useState(state?.record || null);
  const pdfRef = useRef();
  const orgUnitObj = {};
  orgUnits.forEach(ou => {
    orgUnitObj[ou.id] = ou.name;
  })
  orgUnit = {
    ...orgUnit,
    path: orgUnit.path.split('/').map(ou => orgUnitObj[ou] ? orgUnitObj[ou] : ou)
  }

  console.log("OrgUnit", orgUnit);

  useEffect(() => {
    if (state?.record) {
      setCertificate(state.record);
    } else {
      setCertificate(null);
    }
  }, [state]);

  //if there is no certificate data 
  if (!certificate) return <div>No certificate data found.</div>


  const handleDownloadPDF = () => {
    if (pdfRef.current) {
      html2pdf()
        .set({ margin: 0.5, filename: 'Birth Certificate.pdf', html2canvas: { scale: 2 } })
        .from(pdfRef.current)
        .save();
    }
  };


  return (
    <div style={{ background: "#fff", padding: 32, fontFamily: "sans-serif", width: "100%", display: "flex", position: "relative" }}>

      <button
        onClick={handleDownloadPDF}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          padding: "8px 16px",
          background: "#1976d2",
          color: "#000",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Download PDF
      </button>

      <main ref={pdfRef} style={{ margin: "1rem", width: "100%" }}>
        <h2 style={{ fontSize: 24, color: "blue", fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>LATE FOETAL DEATH CERTIFICATE <br />
          အသေမွေးလက်မှတ်
        </h2>
        {/* Header for main certificate */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            color: 'blue', 
            backgroundColor: '#fff'
          }}
        >
          {/* Left Section */}
          <section style={{ color: '#000', fontSize: 16, width: "30%" }}>
            <p style={{ marginBottom: 4, marginTop: 12, fontWeight: 'normal', color:'blue' }}>V.R. Form 153 <br />ဖွားသေပုံစံ ၁၅၃</p>
            <div>
              <p style={{ marginBottom: 4, marginTop: 16, fontWeight: 'normal', color:'blue'}}>
                State / Division <br />ပြည်နယ် / တိုင်းဒေသကြီး
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted blue',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[2] ? orgUnit.path[2] : ''}
                  </span>
              </p>
            </div>
            <div>
              <p style={{ fontWeight: 'normal', color: 'blue' }}>
                District <br />ခရိုင်
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted blue',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[3] ? orgUnit.path[3] : ''}
                  </span>
              </p>

            </div>

            <div>
              <p style={{ fontWeight: 'normal', color:'blue'}}>
                Township <br />မြို့နယ်
               <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted blue',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[4] ? orgUnit.path[4] : ''}
                  </span>
              </p>


            </div>

            <div>
              <p style={{ fontWeight: 'normal', color: 'blue'}}>
                Ward / Village-tract  ............ <br />ရပ်ကွက် / ကျေးရွာအုပ်စု
                {/* <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[5] ? orgUnit.path[5] : ''}
                  </span> */}
              </p>
            </div>
          </section>

          {/* Right Section */}
          <section style={{ marginTop: 40, color: 'blue', fontSize: 16, width: "30%" }}>
            <p style={{ fontWeight: 'normal' }}>
              Page No ............ <br />
              စာမျက်နှာအမှတ်
              {/* <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[5] ? orgUnit.path[5] : '............'}
                  </span> */}
            </p>
            <p style={{ fontWeight: 'normal', color: 'blue' }}>
              Book No............
               <br />
             စာအုပ်အမှတ်
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal', color: 'blue' }}>
              Entry No........... <br /> မှတ်ပုံတင်အမှတ်စဉ်
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal', color:'blue'}}>
              Date of Registration..../.../ <br />
              မှတ်ပုံတင်သည့်ရက်စွဲ
              {/* <span style={{
                  display: 'inline-block',
                  width: 5,
                  borderBottom: '2px dotted black',
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> /
                <span style={{
                  display: 'inline-block',
                  width: 12,
                  borderBottom: '2px dotted black',
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> /
                <span style={{
                  display: 'inline-block',
                  width: 12,
                  borderBottom: '2px dotted black',
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
          </section>

        </header>


        <div style={{ marginTop: 24, width: "100%" }}>
          {/* Particular of Child */}
          <div>
            <div style={borderSolid}></div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", fontWeight: "600", color: 'blue', display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid blue" }}>
                Particular of Child <br />
                ကလေး၏အကြောင်းအရာ
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>


                  <div style={{ width: "50%", paddingBottom: 4, color: 'blue'}}>1. Sex <br />ကျား / မ: {certificate?.["R43kdns3YYL"] || ""} </div>  {/* Name - 1 index */}


                  <div style={{ width: "50%", paddingBottom: 4, color: 'blue' }}>3. Place of Birth <br />မွေးဖွားသည့်နေရာ: {certificate?.["eventdate"] ? certificate["eventdate"].split(" ")[0] : ""}</div>   {/* dob 0th index */}


                </div>

                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%",color: 'blue' }}>2. Date of Birth <br/>မွေးဖွားသည့်ရက်စွဲ:  {certificate?.["wxrDsUO1ELy"] || ""}</div> {/* gender - 2 index */}
                  {/* <div style={{ width: "50%", color: 'blue' }}>4. Place of Birth: {certificate?.["JAU9NM7UqQP"] || ""}</div> 4 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Father */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center",color: "blue", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid blue" }}>
                Particular of Father <br />
                ဖခင်၏အကြောင်းအရာ
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color:"blue" }}>5. Name <br />အမည်: {certificate?.["RKs8td9BnNj"] || ""}</div> {/*  5 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color:"blue" }}>8. Religion <br />ကိုးကွယ်သည့်ဘာသာ: {certificate?.["m4b4SSlipKJ"] || ""}</div> {/*  8 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue"}}>6. Race<br />လူမျိုး: {certificate?.["mIRVmCzC7Tt"] || ""}</div> {/*  6 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue"}}>9. Occupation <br />အလုပ်အကိုင်: {certificate?.["CjjgDMbqfXX"] || ""}</div> {/*  9 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div>
                  <div style={{ width: "50%", padding: '8px', color: "blue"}}>7. Citizenship <br />နိုင်ငံသားနှင့်အမှတ်: {certificate?.["ed2RBrhMhnN"] || ""}</div> {/*  7 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Mother */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", color: "blue", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid blue" }}>
                Particular of Mother <br />
                မိခင်၏အကြောင်းအရာ
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>5. Name  <br />အမည်: {certificate?.["UYmZMZt32hZ"] || ""}</div> {/*  10 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>8. Religion <br />ကိုးကွယ်သည့်ဘာသာ: {certificate?.["QsUp6BSb8Du"] || ""}</div> {/*  13 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>6. Race  <br />လူမျိုး: {certificate?.["XFmGvaRAJqP"] || ""}</div> {/*  11 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>9. Occupation <br />အလုပ်အကိုင်: {certificate?.["vg5hhREmzXe"] || ""}</div> {/*  14 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", color: "blue"}}>7. Citizenship <br />နိုင်ငံသားနှင့်အမှတ်: {certificate?.["r8oFvT4PZwL"] || ""}</div> {/*  12 index */}
                  <div style={{ width: "50%", color: "blue"}}>10. Permanent Address <br />နေရပ်လိပ်စာ(အပြည့်အစုံ): {certificate?.["bVyrfnpCd6i"] || ""}</div> {/*  15 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of person who certify that the child was still born */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", color: "blue", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid blue" }}>
                Particular of Person who certifys that the child was still born <br />
                အသေမွေးကြောင်းထောက်ခံသူ၏ အကြောင်းအရာ 
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>Signature <br /> လက်မှတ်: {certificate?.["UYmZMZt32hZ"] || ""}</div> {/*  10 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>Qualification <br />အရည်အချင်း: {certificate?.["QsUp6BSb8Du"] || ""}</div> {/*  13 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>Name <br />အမည်: {certificate?.["XFmGvaRAJqP"] || ""}</div> {/*  11 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>Address <br />လိပ်စာ: {certificate?.["vg5hhREmzXe"] || ""}</div> {/*  14 index */}
                </div>
               
              </div>
            </div>
            <div style={borderGray}></div>
          </div>


          {/* Particular of Informant */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%",color: "blue", textAlign: "center", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid blue" }}>
                Particular of Informant <br />
                တိုင်ကြားသူ၏အကြောင်းအရာ
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", color: "blue" }}>Signature  <br />လက်မှတ်</div>
                  <div style={{ width: "50%", color: "blue" }}>Relationship to Child <br />ကလေးနှင့်တော်စပ်ပုံ: {certificate?.["eYh3U6sXrTQ"] || ""}</div> {/*  17 index */}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: '16' }}>
                  <div style={{ width: "50%", padding: "8px", color: "blue" }}>Name <br />အမည်: {certificate?.["YdNUYjH3rct"] || ""}</div> {/*  16 index */}
                  <div style={{ width: "50%", padding: "8px", color: "blue" }}>Address <br />လိပ်စာ: {certificate?.["rRpqp6TPWlh"] || ""}</div> {/*  18 index */}
                </div>
              </div>
            </div>
            <div style={borderSolid}></div>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div style={{ marginTop: 16, fontSize: 14 }}>
            <p style={{ width: "100%",color: "blue", display: "block", marginBottom: 8 }}>
              I, the undersigned, do hereby certify that the above mentioned child was still born at the time and
              place mentioned above and registered with the Entry No
              ........ in the Late Foetal Death which is in my legal custody.  <br />
              အထက်ဖော်ပြပါ ကလေးသည် ဖော်ပြပါဒေသနှင့် အချိန်တွင် အမှန်အသေမွေးဖွားပြီး၊ ကျွန်ုပ်၏ လက်ဝယ်တွင် အထက်ပါဒေသအတွက် 
              တရားဝင်ထားရှိသည့် အသေမွေးမှတ်ပုံတင်စာအုပ်၌ အမှတ်စဥ်________________ဖြင့် မှတ်ပုံတင်ပြီးကြောင်း
              သက်သေခံလက်မှတ်ရေးထိုးလိုက်သည်။

                </p>

              {/* <span style={{ ...borderDotted, width: "9%" }}></span> */}
               <p style={{ width: "100%", color: "blue", display: "block", marginBottom: 8 }}>
              Any person who (1) falsifies any of the particulars on this certificate or (2) used it as true, knowing it
              to be false is liable to prosecution.
              <br />
              ဤသက်သေခံလက်မှတ်တွင် (၁) အကြောင်းအရာ လိမ်လည်ထည့်သွင်းသောသူ (၂) လိမ်လည်ထားမှန်းသိလျက်နှင့် 
              အမှန်ကဲ့သို့ အသုံးပြုသောသူများအား တရားစွဲဆိုလိမ့်မည်။
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 16, justifyContent: "space-between", color: "blue"}}>
            <div>
              <p style={{ marginTop: 16, fontWeight: "600" }}>
                Date of issue <br />ထုတ်ပေးသည့်ရက်စွဲ <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}></span>
                / <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}></span> /
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontWeight: "600" }}>Registration Officer's <br />ဖွားသေမှတ်ပုံတင်အရာရှိ၏</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "600" }}>
                Signature  <br /> လက်မှတ် <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 8 }}>
                Name  <br />အမည် <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 8 }}>
                Designation <br />ရာထူး <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
            </div>
          </div>
        </footer>
      </main>

    </div>

  );
};

export default LateFoetalDeathCert;