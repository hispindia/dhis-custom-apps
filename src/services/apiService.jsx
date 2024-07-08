export const ApiService = {
  getReport,
  getRateSummary,
 
};
async function getReport(selectedOuID, datasetId, formattedPeriod,useSelectedUnitOnly) {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/dataSetReport/custom?ds=${datasetId}&pe=${formattedPeriod}&ou=${selectedOuID}&selectedUnitOnly=${useSelectedUnitOnly}`;

  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "text/html",
    },
  });

  if (response.status == "200") {
    let data = await response.text();
    return data;
  } else {
    throw "Error: Report generation failed, Please try again!";
  }
}

async function getRateSummary(datasetId,selectedOuID,ouChildrenIds,formattedPeriod) {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/analytics.json?dimension=dx:${datasetId}.ACTUAL_REPORTS;${datasetId}.EXPECTED_REPORTS;${datasetId}.REPORTING_RATE;${datasetId}.ACTUAL_REPORTS_ON_TIME;${datasetId}.REPORTING_RATE_ON_TIME&dimension=ou:${selectedOuID};${ouChildrenIds}&columns=dx&rows=ou&tableLayout=true&hideEmptyRows=true&displayProperty=SHORTNAME&includeNumDen=false&filter=pe:${formattedPeriod}`;

  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.text();
    return data;
  } else {
    throw "Error: Report generation failed, Please try again!";
  }
}
