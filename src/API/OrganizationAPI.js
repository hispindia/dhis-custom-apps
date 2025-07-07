
const BASE_URL = "https://links.hispindia.org/myr_registry/api";

export const fetchOrgUnits = async () => {
  const response = await fetch(
    `${BASE_URL}/organisationUnits?paging=false&withinUserHierarchy=true&fields=id,name,children[id,name],code,path,level`,
    );
  const data = await response.json();
  return data.organisationUnits;
};
