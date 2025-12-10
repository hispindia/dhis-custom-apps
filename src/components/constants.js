
export const reportFilter = '';
export const InitialQuery = {
  me: {
    resource: "/api/me.json",
    params: {
      fields: ["id", "organisationUnits[id,displayName,code,path]"],
    },
  },
  ouList: {
    resource: "/api/organisationUnits.json",
    params: {
      fields: ["id,name,code,path,children[id,displayName,path]"],
      paging: false,
    },
  },
  optionSets: {
    resource: "/api/optionSets.json",
    params: {
      fields:["id,name,options[code,name]"],
      paging:false,
    }
  },
  dataElements: {
    resource: "/api/dataElements.json",
    params: {
      fields:["id,name,optionSet,optionSetValue"],
      paging:false,
    }
  }
};
