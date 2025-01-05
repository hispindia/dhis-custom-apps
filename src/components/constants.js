export const InitialQuery = {
  me: {
    resource: "me.json",
    params: {
      fields: ["id", "organisationUnits[id,name,code,path,level]"],
    },
  },
  ouList: {
    resource: "organisationUnits.json",
    params: {
      fields: ["id,name,level,code,path,children[id,name]"],
      withinUserHierarchy: true,
      paging: false,
    },
  },
  programList: {
    resource: "programs.json",
    params: {
      fields: [
        "id,name,code,trackedEntityType,programTrackedEntityAttributes[id,valueType,trackedEntityAttribute[id,name,optionSetValue,optionSet[options[name,code]]]],programStages[id,name,programStageDataElements[compulsory,dataElement[id,name,valueType,optionSetValue,optionSet[options[name,code]]]]],organisationUnits",
      ],
      paging: false,
    },
  }
};
export const TRANSFER_IN = "SpRfPV08qRm";
export const TRANSFER_OUT = "JIp0KK5ZKMv";
export const CLIENTID = "P3Spi0kT92n";
export const PREPID = "n2gG7cdigPc";

