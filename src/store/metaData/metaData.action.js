import { METADATA_ACTION_TYPES } from "./metaData.reducer";

export const setProgramList = (programList) => ({
  type: METADATA_ACTION_TYPES.SET_PROGRAM_LIST,
  payload: programList,
});
