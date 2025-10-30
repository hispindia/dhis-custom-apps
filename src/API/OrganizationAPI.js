
const BASE_URL = "https://hmistraining.mm.dhis2.net/train/api";

export const fetchOrgUnits = async () => {
  const response = await fetch(
    `${BASE_URL}/organisationUnits?paging=false&withinUserHierarchy=true&fields=id,displayName,children[id,displayName,path],code,path,level`,
    );
  const data = await response.json();
  return data.organisationUnits;
};
