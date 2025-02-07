export const ApiService = {
  getAllIndicators,
  getAllDataElements,
  getProgramIndicators,
  getIndicatorGroup,
  getFilterIndicator,
  getIndicatorDetails,
  getProgramDetails
 
};
// Api for Searching the Sigle Tei using Id (individual App)
async function getAllIndicators() {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/indicators.json?paging=false&fields=*`;
  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.json();
    return data;
  } else {
    throw "Error: Data generation failed, Please try again!";
  }
}
// Api for Finding the Unique TrackEntityInstance Id  (individual App)   https://amr.hispindia.org/equityamr_training/api/dataElements.json?fields=id,name&paging=false
async function getAllDataElements() {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/dataElements.json?fields=id,name&paging=false`;
  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.json();
    return data;
  } else {
    throw "Error: Data generation failed, Please try again!";
  }
}
// APi for getting All the Events present in single Tei  (individual App)  
async function getProgramIndicators(getTei) {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/programIndicators.json?fields=id,name&paging=false`;
  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.json();
    return data;
  } else {
    throw "Error: Data generation failed, Please try again!";
  }
}

async function getIndicatorGroup() {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/indicatorGroups.json?fields=id,name&paging=false`;
  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.json();
    return data;
  } else {
    throw "Error: Data generation failed, Please try again!";
  }
}

async function getFilterIndicator(selectedGroupIndicator) {  
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/indicatorGroups/${selectedGroupIndicator}.json?paging=false&fields=indicators[id,name]`;
  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.json();
    return data;
  } else {
    throw "Error: Data generation failed, Please try again!";
  }
}

async function getIndicatorDetails(indicatorId) {  
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/29/indicators/${indicatorId}.json?paging=false&fields=*,`;
  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.json();
    return data;
  } else {
    throw "Error: Data generation failed, Please try again!";
  }
}
async function getProgramDetails(programindicatorId) {  
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/29/programIndicators/${programindicatorId}.json?paging=false&fields=*,`;
  let response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status == "200") {
    let data = await response.json();
    return data;
  } else {
    throw "Error: Data generation failed, Please try again!";
  }
}




