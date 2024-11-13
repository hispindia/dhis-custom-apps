import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ApiService } from '../../services/apiService';

// Updated chart configuration function
const getChartOptions = (title, data, color) => ({
  chart: {
    type: 'bar',
    height: 200, // Increased height for better visibility
    backgroundColor: '#f9f9f9',
    spacing: [10, 10, 10, 10], // Less spacing around the chart
  },
  title: {
    text: title,
    align: 'center',
    style: { fontSize: '14px' },
  },
  xAxis: {
    categories: data.map(item => item.label),
    title: { text: null },
    labels: {
      style: { fontSize: '12px' }, // Increase label size
    },
  },
  yAxis: {
    min: 0,
    title: { text: null },
    labels: { enabled: false }, // Hides y-axis labels to make space
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true,
        style: { fontSize: '12px' }, // Larger data labels
      },
      groupPadding: 0.1, // Less padding between bars
      pointWidth: 25, // Wider bars
      color,
    },
  },
  series: [
    {
      name: title,
      data: data.map(item => item.value),
    },
  ],
  credits: { enabled: false },
});

const GroupTracking = () => {
  const [orgUnits, setOrgUnits] = useState([]);
  const [allTei, setAllTei] = useState([]);
  const [selectedOrgUnit, setSelectedOrgUnit] = useState({ id: '', code: '' });
  // sate for the 1 part of the chart Returnees from
  const [originCount, setOriginCount] = useState(0);
  const [firstCount, setFirstCount] = useState(0);
  const [transitCount, setTransitCount] = useState(0);
  const [destinationCount, setDestinationCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state to handle async calls
  //state for  the part 2 of the chart Zero-dose returnees
  const [originCountZeroDose, setOriginCountZeroDose] = useState(0);
  const [firstCountZeroDose, setFirstCountZeroDose] = useState(0);
  const [transitCountZeroDose, setTransitCountZeroDose] = useState(0);
  const [destinationCountZeroDose, setDestinationCountZeroDose] = useState(0);
  // state for the 3 part of the chart Under-immunized
  const [originCountUnder, setOriginCountUnder] = useState(0);
  const [firstCountUnder, setFirstCountUnder] = useState(0);
  const [transitCountUnder, setTransitCountUnder] = useState(0);
  const [destinationCountUnder, setDestinationCountUnder] = useState(0);

  //data structure for the 1 part of the chart Zero-dose returnees
  const originData = [{ label: selectedOrgUnit?.code, value: originCount }];
  const firstContactData = Object.entries(firstCount).map(([label, value]) => ({
    label,  // Region name
    value   // Region count value
  }));
  const TransitData = Object.entries(transitCount).map(([label, value]) => ({
    label,  // Region name
    value   // Region count value
  }));
  const destinationData = Object.entries(destinationCount).map(([label, value]) => ({
    label,  // Region name
    value   // Region count value
  }));

  // data structure for the 2 part of the chart Zero-dose returnees
  const originDataZeroDose = [{ label: selectedOrgUnit?.code, value: originCountZeroDose }];
  const firstContactDataZeroDose = Object.entries(firstCountZeroDose).map(([label, value]) => ({
    label,  // Region name
    value   // Region count value
  }));
  const TransitDataZeroDose = Object.entries(transitCountZeroDose).map(([label, value]) => ({
    label,  // Region name
    value   // Region count value
  }));
  const destinationDataZeroDose = Object.entries(destinationCountZeroDose).map(([label, value]) => ({
    label,  // Region name
    value   // Region count value
  }));


  // data structure for the 3 part of the chart Under-immunized
  const originDataUnder = [{ label: selectedOrgUnit?.code, value: originCountUnder }];
  const firstContactDataUnder = Object.entries(firstCountUnder).map(([label, value]) => ({
    label,  // Region name
    value   // Region count value
  }));
  const TransitDataUnder = Object.entries(transitCountUnder).map(([label, value]) => ({
    label,  // Region name
    value   // Region count value
  }));
  const destinationDataUnder = Object.entries(destinationCountUnder).map(([label, value]) => ({
    label,  // Region name
    value   // Region count value
  }));

  const fetchGroupO = async () => {
    try {

      const response = await ApiService.getAllOrgGroup(); // Use passed TEI or state TEI
      setOrgUnits(response?.options.slice(1));

    } catch (error) {
      setErrorMessage("Error fetching event data.");
    }
  };
  // api for fetc all the Tei list 
  const fetchAllTei = async () => {
    try {

      const response = await ApiService.getAllTei(); // Use passed TEI or state TEI
      setAllTei(response?.trackedEntityInstances);

    } catch (error) {
      setErrorMessage("Error fetching event data.");
    }
  };

  // Data element for the 1 part of the chart Returnees from
  const originDataElement = "Z5xlVrNUci3";//Location coming from - Country
  const firstContactDataElement = "fXZL56HdDsH"//Location coming from - Province 
  //  const firstContactDataElement = "ext8UP5JnKH"
  const TransitcountryDataElement = "ext8UP5JnKH"//Location going to - Province
  const destinationDataElement = "WNhI1Tykxf0"//Location going to - Country
  // Data element for the 2 part of the chart Zero-dose returnees
  const ZeroDoseDataElement1 = "fhTeO7mruuT"
  const ZeroDoseDataElement2 = "aQj0Ba3n6nG"
  const ZeroDoseDataElement3 = "OWA0F7rH7KN"


  // Get data from the Event Api for all the charts  
  const fetchAllEventsWithCount = async () => {
    setLoading(true);
    // Define object to store the data values and counts for the part 1 of the chart Returnees from
    let originCount = 0;
    // let firstdataElementCounts = {}; 
    let parentNameCounts = {};
    let destinationDataElementCounts = {};
    let countryTransitCount = {};
    // define object to store the data values and counts for the part 2 of the chart Zero-dose returnees
    let OriginCountZeroDose = 0;
    let zeroDoseparentNameCounts = {};
    let zeroDosedestinationDataElementCounts = {};
    let zeroDosecountryTransitCount = {};

    //define object to store the data values and counts for the part 3 of the chart Under-immunized
    let OriginCountUnder = 0;
    let underparentNameCounts = {};
    let underdestinationDataElementCounts = {};
    let undercountryTransitCount = {};

    for (const teiObj of allTei) {
      // console.log("Processing TEI:", teiObj);
      try {
        const response = await ApiService.getAllEvent(teiObj?.trackedEntityInstance);

        if (response?.events && response.events.length > 0) {
          const firstEvent = response.events[0];
          // const lastEvent = response?.events[response.events.length - 1];
          const lastEvent = response.events[response.events.length - 1];

          console.log("lastEvent===============",lastEvent)
          const additionalDataElement1 = firstEvent.dataValues.find(
            dataValue => dataValue.dataElement === ZeroDoseDataElement1 // replace `dataElement1` with the first data element ID
          );

          const additionalDataElement2 = firstEvent.dataValues.find(
            dataValue => dataValue.dataElement === ZeroDoseDataElement2 // replace `dataElement2` with the second data element ID
          );

          const additionalDataElement3 = firstEvent.dataValues.find(
            dataValue => dataValue.dataElement === ZeroDoseDataElement3 // replace `dataElement3` with the third data element ID
          );

          const foundDataElement = firstEvent.dataValues.find(
            dataValue => dataValue.dataElement === originDataElement
          );
          console.log("foundDataElement=================", foundDataElement)
          if (foundDataElement && foundDataElement.value == selectedOrgUnit?.code) {
            originCount += 1;
          }

          // Logic for the First origin count from the country parent 
          if (foundDataElement && foundDataElement.value == selectedOrgUnit?.code) {
            const orgUnit = firstEvent.orgUnit;


            // Fetch org name and check for parent (check the parent of the orgunit annd count them)
            const fetchOrgName = async (orgUnit) => {
              setErrorMessage("");

              try {

                const response = await ApiService.getOrgName(orgUnit); // Use passed orgUnit
                // Check if 'parent' exists in the response
                if (response?.parent?.parent?.name) {
                  const parentName = response?.parent?.parent.name;

                  // Update the count for the parent name
                  parentNameCounts[parentName] = (parentNameCounts[parentName] || 0) + 1;

                } else {
                  console.log("No parent information available.");
                }

              } catch (error) {
                setErrorMessage("Error fetching event data.");
              }

            };
            fetchOrgName(orgUnit);

          }


          // const foundfirstDataElement = firstEvent.dataValues.find(
          //   dataValue => dataValue.dataElement === firstContactDataElement
          // );
          // console.log("foundfirstDataElement============",foundfirstDataElement)
          // if(foundfirstDataElement){
          // const value = foundfirstDataElement.value;
          // // Update counts for this value (value is the value of the data element)
          // firstdataElementCounts[value] = (firstdataElementCounts[value] || 0) + 1;
          // console.log(`Found ${firstdataElementCounts} with value: ${value}, current count: ${firstdataElementCounts[value]}`);





          // }
          // const foundfirstDataElement = firstEvent.dataValues.find(
          //   dataValue => dataValue.dataElement === firstContactDataElement
          // );
          // if(foundfirstDataElement){
          //   const value = foundfirstDataElement.value;
          //   // Update counts for this value (value is the value of the data element)
          //   firstdataElementCounts[value] = (firstdataElementCounts[value] || 0) + 1;
          //   console.log(`Found ${firstdataElementCounts} with value: ${value}, current count: ${firstdataElementCounts[value]}`);

          // }


          if (response?.events && response.events.length > 0) {
            // Loop through all events for this TEI
            for (const event of response.events) {
              // Check if the event contains the firstContactDataElement
              const foundcountryTransit = event.dataValues.find(
                (dataValue) => dataValue.dataElement === TransitcountryDataElement
              );
              // count the transit value for the 1  chart 
              if (foundDataElement && foundDataElement?.value == selectedOrgUnit?.code && foundcountryTransit) {
                const value = foundcountryTransit.value;
                // Update counts for this value (value is the value of the data element)
                countryTransitCount[value] = (countryTransitCount[value] || 0) + 1;
              }
              // count the transit value for the 2 chart Zero-dose returnees
              if (foundDataElement && foundDataElement?.value == selectedOrgUnit?.code && foundcountryTransit && additionalDataElement1?.value == "no" && additionalDataElement2?.value == "no" && additionalDataElement3?.value == "no") {
                const value = foundcountryTransit.value;
                // Update counts for this value (value is the value of the data element)
                zeroDosecountryTransitCount[value] = (zeroDosecountryTransitCount[value] || 0) + 1;
              }

            }
          }


          // count the Destination for the first chart 
          const founddestinationDataElement = lastEvent.dataValues.find(
            dataValue => dataValue.dataElement === destinationDataElement
          );
          if (foundDataElement && foundDataElement.value == selectedOrgUnit?.code && founddestinationDataElement) {
            const value = founddestinationDataElement.value;
            // Update counts for this value (value is the value of the data element)
            destinationDataElementCounts[value] = (destinationDataElementCounts[value] || 0) + 1;
            // console.log(`Found ${destinationDataElementCounts} with value: ${value}, current count: ${destinationDataElementCounts[value]}`);

          }


          // destination logic below
          //       if (response?.events && response.events.length > 0) {
          //         // Loop through all events for this TEI
          //         for (const event of response.events) {
          //           console.log("Processing event:", event);

          //           // Check if the event contains the firstContactDataElement
          //           const founddestinationDataElement = event.dataValues.find(
          //             (dataValue) => dataValue.dataElement === destinationDataElement
          //           );
          // console.log("founddestinationDataElement==============",founddestinationDataElement)
          //           if (founddestinationDataElement) {
          //             const value = founddestinationDataElement?.value;
          //             // Update counts for this value (value is the value of the data element)
          //             destinationDataElementCounts[value] = (destinationDataElementCounts[value] || 0) + 1;
          //             console.log(`Found ${destinationDataElement} with value: ${value}, current count: ${destinationDataElementCounts[value]}`);

          //             console.log("destinationDataElement=========",destinationDataElementCounts)
          //           }
          //         }
          //       }


          // const foundfirstDataElement = firstEvent.dataValues.find(
          //   (dataValue) => dataValue.dataElement === firstContactDataElement
          // );



          // if (foundfirstDataElement) {
          //   const value = foundfirstDataElement.value;

          //   // Update counts for this value
          //   counts[value] = (counts[value] || 0) + 1;
          // }

          //first contact logic below

          // if (response?.events && response.events.length > 0) {
          //   // Loop through all events for this TEI
          //   for (const event of response.events) {
          //     console.log("Processing event:", event);

          //     // Check if the event contains the firstContactDataElement
          //     const foundfirstDataElement = event.dataValues.find(
          //       (dataValue) => dataValue.dataElement === firstContactDataElement
          //     );

          //     if (foundfirstDataElement) {
          //       const value = foundfirstDataElement.value;
          //       // Update counts for this value (value is the value of the data element)
          //       firstdataElementCounts[value] = (firstdataElementCounts[value] || 0) + 1;
          //       console.log(`Found ${firstContactDataElement} with value: ${value}, current count: ${firstdataElementCounts[value]}`);

          //       console.log("firstdataElementCounts=========",firstdataElementCounts)
          //     }
          //   }
          // }

          // Zero Dose Logic Below  

          if (foundDataElement && foundDataElement?.value == selectedOrgUnit?.code && additionalDataElement1?.value == "no" && additionalDataElement2?.value == "no" && additionalDataElement3?.value == "no") {
            OriginCountZeroDose += 1;
          }


          // count the Parent logic for the 2 chart first contact           
          if (foundDataElement && foundDataElement.value == selectedOrgUnit?.code && additionalDataElement1?.value == "no" && additionalDataElement2?.value == "no" && additionalDataElement3?.value == "no") {
            const orgUnit = firstEvent.orgUnit;
            // Fetch org name and check for parent
            const fetchOrgName = async (orgUnit) => {
              setErrorMessage("");

              try {

                const response = await ApiService.getOrgName(orgUnit); // Use passed orgUnit
                // Check if 'parent' exists in the response
                if (response.parent?.parent?.name) {
                  const parentName = response?.parent?.parent.name;

                  // Update the count for the parent name
                  zeroDoseparentNameCounts[parentName] = (zeroDoseparentNameCounts[parentName] || 0) + 1;

                } else {
                  console.log("No parent information available.");
                }

              } catch (error) {
                setErrorMessage("Error fetching event data.");
              }

            };
            fetchOrgName(orgUnit);

          }
          // destination logic Count for the 2 nd chart with AdditionalDatElements conditions
          if (foundDataElement && foundDataElement.value == selectedOrgUnit?.code && founddestinationDataElement && additionalDataElement1?.value == "no" && additionalDataElement2?.value == "no" && additionalDataElement3?.value == "no") {
            const value = founddestinationDataElement.value;
            // Update counts for this value (value is the value of the data element)
            zeroDosedestinationDataElementCounts[value] = (zeroDosedestinationDataElementCounts[value] || 0) + 1;
            // console.log(`Found ${destinationDataElementCounts} with value: ${value}, current count: ${destinationDataElementCounts[value]}`);

          }

        }
      } catch (error) {
        console.error(`Error fetching events for TEI: ${teiObj.trackedEntityInstance}`, error);
      }
    }
    setOriginCount(originCount); // Update state with the count
    // setFirstCount(firstdataElementCounts);
    setFirstCount(parentNameCounts);
    setDestinationCount(destinationDataElementCounts)
    setTransitCount(countryTransitCount)
    // Zero Dose set the data in the defined State 
    setOriginCountZeroDose(OriginCountZeroDose)
    setFirstCountZeroDose(zeroDoseparentNameCounts)
    setTransitCountZeroDose(zeroDosecountryTransitCount)
    setDestinationCountZeroDose(zeroDosedestinationDataElementCounts)
    // Under utilized 
    setOriginCountUnder(OriginCountUnder)
    setFirstCountUnder(underparentNameCounts)
    setTransitCountUnder(undercountryTransitCount)
    setDestinationCountUnder(underdestinationDataElementCounts)

    setLoading(false);
  };

  // console.log("originCount=============",eventCount1)
  useEffect(() => {
    fetchGroupO();
    fetchAllTei();

  }, []);
  useEffect(() => {
    // Run fetchAllEventsWithCount whenever allTei or selectedOrgUnit changes
    if (allTei.length > 0 && selectedOrgUnit) {

      fetchAllEventsWithCount(); // Now we're actually calling the function
    }
  }, [selectedOrgUnit.id]);
  const handleOrgUnitChange = (event) => {
    // const orgUnitId = event.target.value;
    const selectedIndex = event.target.selectedIndex; // Get the index of selected option
    const selectedOrgUnit = orgUnits[selectedIndex - 1]; // Adjust for the disabled placeholder option
    setSelectedOrgUnit({ id: selectedOrgUnit?.id, code: selectedOrgUnit?.code });
  };
  console.log("selected org unit", selectedOrgUnit)
  console.log("allTei==============", allTei)
  console.log("destinationCount============", destinationCount)

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5' }}>


      {/* Dropdown for selecting Org Unit */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="orgUnitSelect" style={{ marginRight: '10px' }}>Org Unit:</label>

        <select id="orgUnitSelect" onChange={handleOrgUnitChange} value={selectedOrgUnit?.id || ''}>
          <option value="" disabled>Select Org Unit</option>
          {orgUnits?.map(orgUnit => (
            <option key={orgUnit?.id} value={orgUnit?.id}>{orgUnit?.code}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        selectedOrgUnit.id && firstCount && destinationCount && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#1f77b4' }}>Migration Inflow: Returnees from {selectedOrgUnit?.code}</h2>
              <div style={{ display: 'flex', gap: '10px', padding: '15px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('Origin', originData, '#1f77b4')} />
                </div>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('First Contact', firstContactData, '#17a2b8')} />
                </div>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('In Transit', TransitData, '#20c997')} />
                </div>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('Destination', destinationData, '#ff7f0e')} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#1f77b4' }}>Migration Inflow: Zero-dose returnees from {selectedOrgUnit?.code}</h2>
              <div style={{ display: 'flex', gap: '10px', padding: '15px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('Origin', originDataZeroDose, '#1f77b4')} />
                </div>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('First Contact', firstContactDataZeroDose, '#17a2b8')} />
                </div>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('In Transit', TransitDataZeroDose, '#20c997')} />
                </div>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('Destination', destinationDataZeroDose, '#ff7f0e')} />
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#1f77b4' }}>Migration Inflow: Under-immunized returnees from {selectedOrgUnit?.code}</h2>
              <div style={{ display: 'flex', gap: '10px', padding: '15px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('Origin', originDataUnder, '#1f77b4')} />
                </div>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('First Contact', firstContactDataUnder, '#17a2b8')} />
                </div>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('In Transit', TransitDataUnder, '#20c997')} />
                </div>
                <div style={{ flex: 1 }}>
                  <HighchartsReact highcharts={Highcharts} options={getChartOptions('Destination', destinationDataUnder, '#ff7f0e')} />
                </div>
              </div>
            </div>

          </>
        )
      )}

    </div>
  );
};

export default GroupTracking;

