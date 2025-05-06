function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export class OPDService {}
_defineProperty(OPDService, "EventAPi", async (pId, tIid) => {
  const requestOptions = {
    method: 'GET'
  };
  let response = await fetch(`../../events.json?skipPaging=true&program=${pId}&trackedEntityInstance=${tIid}&fields=dataValues[dataElement,value],eventDate,programStage,status`, requestOptions);
  return response.json();
});
_defineProperty(OPDService, "ProgramStages", async () => {
  const requestOptions = {
    method: 'GET'
  };
  let response = await fetch(`../../programStages.json?paging=false&fields=id,name`, requestOptions);
  return response.json();
});
_defineProperty(OPDService, "AllDataelement", async () => {
  const requestOptions = {
    method: 'GET'
  };
  let response = await fetch(`../../dataElements.json?paging=false&domainType=TRACKER&fields=id,name`, requestOptions);
  return response.json();
});
_defineProperty(OPDService, "Programoptions", async () => {
  const requestOptions = {
    method: 'GET'
  };
  let response = await fetch(`../../29/sqlViews/oZAXWFlZgI7/data?paging=false`, requestOptions);
  return response.json();
});
_defineProperty(OPDService, "tableDataplot", async _ref => {
  let {
    id,
    page,
    filter
  } = _ref;
  let url = `../../tracker/trackedEntities.json?orgUnit=Fn51zf6ifbm&program=${id}&ouMode=DESCENDANTS&page=${page}&totalPages=true`;
  if (filter) {
    for (const key in filter) {
      url += "&filter=" + key + ":eq:" + filter[key];
    }
  }
  const requestOptions = {
    method: 'GET'
  };
  let response = await fetch(url, requestOptions);
  return response.json();
});
_defineProperty(OPDService, "tableHeaderData", async selectedProgramValue => {
  const requestOptions = {
    method: 'GET'
  };
  let response = await fetch(`../../programs/${selectedProgramValue}.json?fields=programTrackedEntityAttributes%5BtrackedEntityAttribute%5Bid,name,formName,attributeValues%5Battribute%5Bid,name,code%5D,value%5D%5D%5D`, requestOptions);
  return response.json();
});
_defineProperty(OPDService, "collectAttributes", async pId => {
  const requestOptions = {
    method: 'GET'
  };
  let response = await fetch(`../../programs/${pId}.json?fields=programTrackedEntityAttributes%5BtrackedEntityAttribute%5Bid,name,formName,attributeValues%5Battribute%5Bid,name,code%5D,value%5D%5D%5D`, requestOptions);
  return response.json();
});
//working on this api........
_defineProperty(OPDService, "trackedEntityInstances", async selectedProgramValue => {
  const requestOptions = {
    method: 'GET'
  };
  let response = await fetch(`../../trackedEntityInstances/t8hYOJDA2Od.json?program=${selectedProgramValue}`, requestOptions);
  return response.json();
});
// found records with single programe and multiple stages........ 
_defineProperty(OPDService, "trackedEntityInstancesMultipleStages", async (selectedProgramValue, tie) => {
  const requestOptions = {
    method: 'GET'
  };
  let response = await fetch(`../../trackedEntityInstances/${tie}.json?program=${selectedProgramValue}&fields=*`, requestOptions);
  return new Promise((resolve, reject) => {
    if (response.status == 200) resolve(response.json());else reject({});
  });
});
_defineProperty(OPDService, "screeningCloseRelations", async tie => {
  const requestOptions = {
    method: 'GET'
  };
  let response = await fetch(`../../relationships.json?tei=${tie}`, requestOptions);
  return new Promise((resolve, reject) => {
    if (response.status == 200) resolve(response.json());else reject({});
  });
});