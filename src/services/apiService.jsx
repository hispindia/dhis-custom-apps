export const ApiService = {
  getQrCodeTei,
  getUniqeTei,
  getEvent,
  getOrgName,
  getMedicineName,
  getAllOrgGroup,
  getAllTei,
  getAllEvent
 
};
// Api for Searching the Sigle Tei using Id (individual App)
async function getQrCodeTei(qrCodeValue) {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/trackedEntityInstances.json?fields=trackedEntityInstance&ouMode=ALL&program=P16V9R9KVTY&filter=nGFzugdMWaW:eq:${qrCodeValue}`;
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
// Api for Finding the Unique TrackEntityInstance Id  (individual App)
async function getUniqeTei(uniqueIdValue) {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/trackedEntityInstances.json?fields=trackedEntityInstance&ouMode=ALL&program=P16V9R9KVTY&filter=tyHjw3Tb3Gr:eq:${uniqueIdValue}`;
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
async function getEvent(getTei) {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/events.json?trackedEntityInstance=${getTei}&order=eventDate:asc&fields=event,orgUnit,eventDate,dataValues&skipPaging=true`;
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
//Api for getting All Organization Names and Id (individual App)

async function getOrgName(orgunit) {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/organisationUnits/${orgunit}.json?fields=id,name,parent%5Bid,name,parent%5Bid,name%5D%5D`;
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
// Api for the All Data Elements   (individual App)
async function getMedicineName() {
 
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/dataElements.json?fields=id,name,shortName&paging=false`;
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
//api for Group Tracking All organizations
async function getAllOrgGroup() {
 
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/optionSets/V1ZvYqbDDWP.json?fields=options[id,name,code]`;
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
async function getAllTei() {
 
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/trackedEntityInstances.json?fields=trackedEntityInstance&ouMode=ALL&program=P16V9R9KVTY`;
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

async function getAllEvent(tei) {
 
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/events.json?trackedEntityInstance=${tei}&order=eventDate:asc&fields=event,orgUnit,eventDate,dataValues&skipPaging=true`;

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


