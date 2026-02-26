export const NUMBERS = {
  0: "၀",
  1: "၁",
  2: "၂",
  3: "၃",
  4: "၄",
  5: "၅",
  6: "၆",
  7: "၇",
  8: "၈",
  9: "၉",
  10: "၁၀",
  11: "၁၁",
  12: "၁၂",
  13: "၁၃",
  14: "၁၄",
  15: "၁၅",
};
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
      fields: ["id,name,options[code,name]"],
      paging: false,
    },
  },
  dataElements: {
    resource: "/api/dataElements.json",
    params: {
      fields: ["id,name,optionSet,optionSetValue"],
      paging: false,
    },
  },
};
