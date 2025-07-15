
export const reportFilter = '';
export const InitialQuery = {
  me: {
    resource: "me.json",
    params: {
      fields: ["id", "organisationUnits[id,name,code,path]"],
    },
  },
  ouList: {
    resource: "organisationUnits.json",
    params: {
      fields: ["id,name,code,path,children[id,name,path]"],
      paging: false,
    },
  },
  optionSets: {
    resource: "optionSets.json",
    params: {
      fields:["id,name,options[code,name]"],
      paging:false,
    }
  },
  dataElements: {
    resource: "dataElements.json",
    params: {
      fields:["id,name,optionSet,optionSetValue"],
      paging:false,
    }
  }
};
