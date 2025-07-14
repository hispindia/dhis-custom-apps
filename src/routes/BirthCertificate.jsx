import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";
import { data } from "autoprefixer";
import { useLocation, useParams } from "react-router-dom";
import { red } from "@mui/material/colors";


const borderDotted = {
  display: "inline-block",
  borderBottom: "2px dotted red",
  verticalAlign: "middle",
};
const borderSolid = {
  borderBottom: "2px solid red",
  width: "100%",
};
const borderGray = {
  borderBottom: "2px solid red",
  width: "100%",
};

const borderBlack = {
  borderBottom: "2px dotted red",
  width: "100%"
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '350px',
    marginBottom: '1.5rem',
    color: 'red'
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
    borderBottom: '2px dotted red',
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
    borderBottom: '2px dotted red',
    marginLeft: '5px',
    verticalAlign: 'middle',
  },
  rightSection: {
    marginTop: '2.5rem',
  },
};

const BirthCertificate = ({orgUnit, orgUnits}) => {
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
          color: "black",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Download PDF
      </button>

      <main ref={pdfRef} style={{ margin: "1rem", width: "100%" }}>
        <h2 style={{ fontSize: 24, color: "red", fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>BIRTH CERTIFICATE <br />အရှင်မွေးလက်မှတ်</h2>
        {/* Header for main certificate */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            color: 'red', 
            backgroundColor: '#fff'
          }}
        >
          {/* Left Section */}
          <section style={{ color: '#000', fontSize: 16, width: "30%" }}>
            <p style={{ marginBottom: 4, marginTop: 12, fontWeight: 'normal', color:'red' }}>V.R. Form 103 <br />ဖွားသေပုံစံ ၁၀၃</p>
            <div>
              <p style={{ marginBottom: 4, marginTop: 16, fontWeight: 'normal', color:'red'}}>
                State / Division <br />ပြည်နယ် / တိုင်းဒေသကြီး
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted red',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[2] ? orgUnit.path[2] : ''}
                  </span>
              </p>
            </div>
            <div>
              <p style={{ fontWeight: 'normal', color: 'red' }}>
                District <br />ခရိုင်
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted red',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[3] ? orgUnit.path[3] : ''}
                  </span>
              </p>

            </div>

            <div>
              <p style={{ fontWeight: 'normal', color:'red'}}>
                Township <br />မြို့နယ်
               <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted red',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[4] ? orgUnit.path[4] : ''}
                  </span>
              </p>


            </div>

            <div>
              <p style={{ fontWeight: 'normal', color: 'red'}}>
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
          <section style={{ marginTop: 40, color: 'red', fontSize: 16, width: "30%" }}>
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
            <p style={{ fontWeight: 'normal', color: 'red' }}>
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
            <p style={{ marginBottom: 4, fontWeight: 'normal', color: 'red' }}>
              Entry No........... <br /> မှတ်ပုံတင်အမှတ်စဉ်
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal', color:'red'}}>
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
              <div style={{ width: "25%", textAlign: "center", fontWeight: "600", color: 'red', display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                Particular of Child  <br />
                ကလေး၏အကြောင်းအရာ
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>


                  <div style={{ width: "50%", paddingBottom: 4, color: 'red'}}>1. Name  <br />အမည်: {certificate?.["EUfz92HiiVD.R43kdns3YYL"] || ""} </div>  {/* Name - 1 index */}
                  <br />
                


                  <div style={{ width: "50%", paddingBottom: 4, color: 'red' }}>3. Date of Birth <br />မွေးဖွားသည့်ရက်စွဲနှင့်အချိန်: {certificate?.["eventdate"] ? certificate["eventdate"].split(" ")[0] : ""}</div>   {/* dob 0th index */}


                </div>

                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%",color: 'red' }}>2. Sex <br />ကျား / မ:  {certificate?.["EUfz92HiiVD.wxrDsUO1ELy"] || ""}</div> {/* gender - 2 index */}
                  <div style={{ width: "50%", color: 'red' }}>4. Place of Birth <br />မွေးဖွားသည့်နေရာ: {certificate?.["EUfz92HiiVD.JAU9NM7UqQP"] || ""}</div> {/* 4 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Father */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center",color: "red", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                Particular of Father <br />
                ဖခင်၏အကြောင်းအရာ
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color:"red" }}>5. Name <br />အမည်: {certificate?.["EUfz92HiiVD.RKs8td9BnNj"] || ""}</div> {/*  5 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color:"red" }}>8. Religion <br />ကိုးကွယ်သည့်ဘာသာ: {certificate?.["EUfz92HiiVD.m4b4SSlipKJ"] || ""}</div> {/*  8 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "red"}}>6. Race <br />လူမျိုး: {certificate?.["EUfz92HiiVD.mIRVmCzC7Tt"] || ""}</div> {/*  6 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "red"}}>9. Occupation <br />အလုပ်အကိုင်: {certificate?.["EUfz92HiiVD.CjjgDMbqfXX"] || ""}</div> {/*  9 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div>
                  <div style={{ width: "50%", padding: '8px', color: "red"}}>7. Citizenship <br />နိုင်ငံသားနှင့်အမှတ်: {certificate?.["EUfz92HiiVD.ed2RBrhMhnN"] || ""}</div> {/*  7 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Mother */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", color: "red", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                Particular of Mother <br />
                မိခင်၏အကြောင်းအရာ
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>5. Name <br />အမည်: {certificate?.["EUfz92HiiVD.UYmZMZt32hZ"] || ""}</div> {/*  10 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>8. Religion <br />ကိုးကွယ်သည့်ဘာသာ: {certificate?.["EUfz92HiiVD.QsUp6BSb8Du"] || ""}</div> {/*  13 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>6. Race <br />လူမျိုး: {certificate?.["EUfz92HiiVD.XFmGvaRAJqP"] || ""}</div> {/*  11 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>9. Occupation <br />အလုပ်အကိုင်: {certificate?.["EUfz92HiiVD.vg5hhREmzXe"] || ""}</div> {/*  14 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", color: "red"}}>7. Citizenship <br />နိုင်ငံသားနှင့်အမှတ်: {certificate?.["EUfz92HiiVD.r8oFvT4PZwL"] || ""}</div> {/*  12 index */}
                  <div style={{ width: "50%", color: "red"}}>10. Permanent Address <br />နေရပ်လိပ်စာ(အပြည့်အစုံ): {certificate?.["EUfz92HiiVD.bVyrfnpCd6i"] || ""}</div> {/*  15 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Informant */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%",color: "red", textAlign: "center", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                Particular of Informant <br />
                တိုင်ကြားသူ၏အကြောင်းအရာ
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", color: "red" }}>Signature <br />လက်မှတ်</div>
                  <div style={{ width: "50%", color: "red" }}>Relationship to Child <br />ကလေးနှင့်တော်စပ်ပုံ: {certificate?.["EUfz92HiiVD.eYh3U6sXrTQ"] || ""}</div> {/*  17 index */}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: '16' }}>
                  <div style={{ width: "50%", padding: "8px", color: "red" }}>Name <br />အမည်: {certificate?.["EUfz92HiiVD.YdNUYjH3rct"] || ""}</div> {/*  16 index */}
                  <div style={{ width: "50%", padding: "8px", color: "red" }}>Address <br />လိပ်စာ: {certificate?.["EUfz92HiiVD.rRpqp6TPWlh"] || ""}</div> {/*  18 index */}
                </div>
              </div>
            </div>
            <div style={borderSolid}></div>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div style={{ marginTop: 16, fontSize: 14 }}>
            <p style={{ width: "100%",color: "red", display: "block", marginBottom: 8 }}>
              I, the undersigned, do hereby certify that the above mentioned child  was born
              alive at the time and place mentioned above and registered with the Entry No ........ 
              in the Birth Register which is in my legal custody. <br />
              အထက်ဖော်ပြပါ ကလေးသည် ဖော်ပြပါဒေသနှင့် အချိန်တွင် အမှန်မွေးဖွားပြီး ကျွန်ုပ် ၏ လက်ဝယ်တွင် 
              အထက်ပါဒေသအတွက် တရားဝင်ထားရှိသည့် အရှင်မွေး မှတ်ပုံ တင်စာအုပ်၌ အမှတ်စဉ်________________ဖြင့်
               မှတ်ပုံတင်ပြီး‌ကြောင်း သက်သေခံ လက်မှတ် ရေးထိုးလိုက်သည်။

             </p>
              {/* <span style={{ ...borderDotted, width: "9%" }}></span> */}
               <p style={{ width: "100%", color: "red", display: "block", marginBottom: 8 }}>
              Any person who (1) falsifies any of the particulars on this certificate or (2) used it as true, knowing it
              to be false is liable to prosecution.
              <br />
              ဤသက်သေခံလက်မှတ်တွင် (၁) အကြောင်းအရာ လိမ်လည်ထည့်သွင်းသောသူ (၂) လိမ်လည်ထားမှန်းသိလျက်နှင့် အမှန်ကဲ့သို့ အသုံးပြုသောသူများအား တရားစွဲဆိုလိမ့်မည်။
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 16, justifyContent: "space-between", color: "red"}}>
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
                Signature <br /> လက်မှတ် <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 8 }}>
                Name <br />အမည်<span style={{ ...borderDotted, width: 80 }}></span>
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

export default BirthCertificate;