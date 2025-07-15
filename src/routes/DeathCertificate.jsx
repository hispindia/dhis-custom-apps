import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { fetchDeathCertficateRecords } from "../API/DeathCertAPI";
import { useLocation, useParams } from "react-router-dom";

const styles = {
    body: {
        background: "#fff",
        padding: "2rem",
        fontFamily: "sans-serif",
    },
    container: {
        display: "flex",
        alignItems: "flex-start",
    },
    main: {
        width: "68%",
    },
    h2: {
        fontSize: "2rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "0.5rem",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        gap: "350px",
    },
    section: {},
    p: {
        marginBottom: "0.25rem",
        marginTop: 0,
    },
    mt3: {
        marginTop: "0.75rem",
    },
    mt4: {
        marginTop: "1rem",
    },
    borderDotted: {
        display: "inline-block",
        borderBottom: "2px dotted black",
        verticalAlign: "middle",
    },
    borderSolid: {
        borderBottom: "2px solid black",
        width: "100%",
    },
    borderBlack: {
        borderBottom: "2px solid black",
        width: "100%"
    },
    borderGray: {
        borderBottom: "2px solid #e5e7eb",
        width: "100%",
    },
    w31: { width: "31%" },
    w24: { width: "6rem" },
    w32: { width: "8rem" },
    w3: { width: "0.75rem" },
    mt10: { marginTop: "2.5rem" },
    hr: {
        marginTop: "1.25rem",
        borderTop: "2px solid black",
        width: "100%",
    },
    hrGray: {
        marginTop: "1.25rem",
        borderTop: "2px solid #e5e7eb",
        width: "100%",
    },
    h3: {
        fontSize: "1.125rem",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: "1rem",
        marginBottom: "0.5rem",
    },
    table: {
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        borderColor: "black",
        marginTop: "0.5rem",
    },
    td: {
        width: "16.666%",
        padding: "0.5rem 0.25rem",
        verticalAlign: "top",
    },
    tdWide: {
        width: "33.333%",
        padding: "0.5rem 0.25rem",
        verticalAlign: "top",
    },
    pt4: { paddingTop: "1rem" },
    mt2: { marginTop: "0.5rem" },
    footer: {
        marginTop: "1rem",
        fontSize: "0.95rem",
    },
    flex: {
        display: "flex",
        alignItems: "flex-start",
        marginTop: "1rem",
        justifyContent: "space-between",
    },
    fontSemibold: { fontWeight: "600" },
    w6: { width: "1.5rem", display: "inline-block", verticalAlign: "middle" },
    w20: { width: "5rem", display: "inline-block", borderBottom: "2px dotted black", verticalAlign: "middle" },
    w17: { width: "4.25rem", display: "inline-block", borderBottom: "2px dotted black", verticalAlign: "middle" },
    mt2Text: { marginTop: "0.5rem" },
};

const DeathCertificate = ({orgUnit, orgUnits, dataElements}) => {

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


    useEffect(() => {
        if (state?.record) {
            setCertificate(state.record);
        } else {
            setCertificate(null);
        }
    }, [state]);

    const handleDownloadPDF = () => {
        if (pdfRef.current) {
            html2pdf()
                .set({ margin: 0.5, filename: 'Death Certificate.pdf', html2canvas: { scale: 2 } })
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
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Download PDF
      </button>

        <main ref={pdfRef} style={{ margin: "1rem", width: "100%" }}>
            <h2 style={styles.h2}>DEATH CERTIFICATE <br />သေဆုံးမှုလက်မှတ် </h2>

        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            color: '#000', // Force black text
            backgroundColor: '#fff'
          }}
        >
          {/* Left Section */}
          <section style={{ color: '#000', fontSize: 16, width: "50%" }}>
            <p style={{ marginBottom: 4, marginTop: 12, fontWeight: 'normal' }}>V.R. Form 203 ဖွားသေပုံစံ ၂၀၃</p>
            <div>
              <p style={{ marginBottom: 4, marginTop: 16, fontWeight: 'normal' }}>
                State / Division <br />ပြည်နယ် / တိုင်းဒေသကြီး
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[2] ? orgUnit.path[2] : ''}
                  </span>
              </p>
            </div>
            <div>
              <p style={{ fontWeight: 'normal' }}>
                District <br />ခရိုင်
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: 90,
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[3] ? orgUnit.path[3] : ''}
                  </span>
              </p>

            </div>

            <div>
              <p style={{ fontWeight: 'normal' }}>
                Township  <br />မြို့နယ်
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: 90,
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[4] ? orgUnit.path[4] : ''}
                  </span>
              </p>

            </div>

            <div>
              <p style={{ fontWeight: 'normal' }}>
                Ward / Village-tract ............ <br />ရပ်ကွက် / ကျေးရွာအုပ်စု
                  {/* <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: 90,
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[5] ? orgUnit.path[5] : ''}
                  </span> */}
              </p>
            </div>
          </section>

          {/* Right Section */}
          <section style={{ marginTop: 40, color: '#000', fontSize: 16,  width: "30%" }}>
            <p style={{ fontWeight: 'normal' }}>
              Page No............  <br />
              စာမျက်နှာအမှတ်
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ fontWeight: 'normal' }}>
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
            <p style={{ marginBottom: 4, fontWeight: 'normal' }}>
              Entry No........... <br /> မှတ်ပုံတင်အမှတ်စဉ်
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal' }}>
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

                    <hr style={styles.hr} />
                    <h3 style={styles.h3}>Particulars of Deceased <br />
                    သေဆုံးသူ၏အကြောင်းအရာ
                    </h3>
                    <hr style={styles.hr} />

                    <table style={styles.table}>
                        <tbody>
                            <tr>
                                <td style={styles.td}>1. Name <br />အမည်: {certificate?.["aTbE3kYe98D"] || ""}</td>
                                <td style={styles.td}>7. Race <br />လူမျိုး: {certificate?.["b9BVo7x8248"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>2. Sex <br />ကျား / မ: {certificate?.["wxrDsUO1ELy"] || ""}</td>
                                <td style={styles.td}>8. Citizenship <br />နိုင်ငံသားနှင့်အမှတ်: {certificate?.["aTbE3kYe98D"] || ""}</td>
                            </tr>
                           

                            <tr>
                                <td style={styles.td}>3. Date of death <br />သေဆုံးသည့်ရက်စွဲနှင့်အချိန်: {certificate?.["jGGNvNYhu47"] ? certificate["jGGNvNYhu47"].split(" ")[0]: ""}</td>
                                <td style={styles.td}>9. Religion <br />ကိုးကွယ်သည့်ဘာသာ: {certificate?.["b9BVo7x8248"] || ""}</td>
                            </tr>
                            
                            <tr>
                                <td style={styles.td}>4. Place of death <br />သေဆုံးသည့်နေရာ: {certificate?.["MOV6uMBMkph"] || ""}</td>
                                <td style={styles.td}>10. Permanent Address <br />နေရပ်လိပ်စာ(အပြည့်အစုံ): {certificate?.["iXXvJAxbOtd"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>5. Age <br />အသက်: {certificate?.["KFGxB6wpRxi"] || ""}</td>
                                <td style={styles.td}>11. Name of Father of the deceased <br />သေဆုံးသူ၏ဖခင်အမည်: {certificate?.["OpzRl6KIFVU"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>6. Occupation <br />အလုပ်အကိုင်: {certificate?.["s3wKlMmBs8p"] || ""}</td>
                                <td style={styles.td}>12. Name of Mother of the deceased <br />သေဆုံးသူ၏မိခင်အမည်: {certificate?.["xHcmoS3icZD"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>13. Cause of Death <br />မည်သည့်အကြောင်းကြောင့် (သို့) ရောဂါဖြင့် သေဆုံးသည်။: {(dataElements['nQy5xQrOMXj'] && dataElements['nQy5xQrOMXj'][certificate["nQy5xQrOMXj"]]) ? dataElements['nQy5xQrOMXj'][certificate["nQy5xQrOMXj"]] :  ""}</td>
                                <td></td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>14. Informat's Signature <br />တိုင်ကြားသူ၏ လက်မှတ်</td>
                                <td style={styles.td}>Relationship to deceased <br />သေဆုံးသူနှင့်တော်စပ်ပုံ: {certificate?.["qa5eIb216nF"] || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ ...styles.td, ...styles.pt4 }}>Name <br />အမည်: {certificate?.["YdNUYjH3rct"] || ""}</td>
                                <td style={{ ...styles.td, ...styles.pt4 }}>Address <br />လိပ်စာ: {certificate?.["rRpqp6TPWlh"] || ""}</td>
                            </tr>
                         
                            <tr>
                                <td style={styles.td}>15. Cause of Death Certifiers <br />သေဆုံးသည့်အကြောင်းအရာ (သို့) ရောဂါ ထောက်ခံသူ၏:  {certificate?.["aTbE3kYe98D"] || ""}</td>
                                <td style={styles.td}>
                                    Signature <br />လက်မှတ် <span style={styles.w17}></span>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={styles.pt4}>
                                    Name <br />အမည် {certificate?.["RkPGXTudjFI"] || ""} <span style={styles.w17}></span>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={styles.pt4}>
                                    Designation <br />ရာထူး {certificate?.["NxtfpJnOOHx"] || ""} <span style={styles.w17}></span>
                                </td>
                            </tr>
                           
                        </tbody>
                    </table>

                    <footer style={styles.footer}>
                        <div>
                            <p style={{ width: "100%", display: "block", marginBottom: 8 }}>
                                I, the undersigned, do hereby certify that the mentioned above   deceased was dead 
                                 at the time and place mentioned above and registered with the Entry No in the Death Register
                                 and that Such Register Book is now legally in my custody.
                                 အထက်ဖော်ပြပါ သေဆုံးသူသည် ဖော်ပြပါဒေသနှင့် အချိန်တွင် အမှန်သေဆုံးပြီး ကျွန်ု 
                                 ပ်၏ လက်ဝယ်တွင် အထက်ပါဒေသအတွက် တရားဝင်ထားရှိသည့် သေဆုံးမှု မှတ်ပုံ တင်စာအုပ်၌ အမှတ်စဉ်________________ <br />
                                <span style={{ ...styles.borderDotted, width: "9%", marginLeft: 4, marginRight: 4 }}></span>
                                
                                ဖြင့် မှတ်ပုံတင်ပြီး‌ကြောင်း သက်သေခံ လက်မှတ် ရေးထိုးလိုက်သည်။
                            </p>
                            <p style={{ width: "100%", display: "block", marginBottom: 8 }}>
                                Any person who (1) falsifies any of the particulars on this certificate 
                                or (2) used it as true, knowing it to be false is liable to prosecution. <br />
                                ဤသက်သေခံလက်မှတ်တွင် (၁) အကြောင်းအရာ လိမ်လည်ထည့်သွင်းသောသူ (၂) 
                                လိမ်လည်ထားမှန်းသိလျက်နှင့် အမှန်ကဲ့သို့ အသုံးပြုသောသူများအား တရားစွဲဆိုလိမ့်မည်။
                                
                            </p>
                        </div>
                        <div style={styles.flex}>
                            <div>
                                <p style={{ marginTop: 16, fontWeight: "600" }}>
                                    Date of issue <span style={styles.w6}></span> / <span style={styles.w6}></span> /{" "}
                                </p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <span style={styles.fontSemibold}>Registration Officer's <br /> ဖွားသေမှတ်ပုံတင်အရာရှိ၏</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={styles.fontSemibold}>
                                    Signature <br /> လက်မှတ် <span style={styles.w20}></span>
                                </span>
                                <span style={{ ...styles.fontSemibold, ...styles.mt2Text }}>
                                    Name <br />အမည် <span style={styles.w20}></span>
                                </span>
                                <span style={{ ...styles.fontSemibold, ...styles.mt2Text }}>
                                    Designation <br />ရာထူး<span style={styles.w20}></span>
                                </span>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
      
    )

};

export default DeathCertificate