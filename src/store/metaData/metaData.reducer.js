export const METADATA_ACTION_TYPES = {
  SET_PROGRAM_LIST: "SET_PROGRAM_LIST",
};

export const INITIAL_STATE = {
  programList: [],
};

export const metaDataReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case METADATA_ACTION_TYPES.SET_PROGRAM_LIST:
      return { ...state, programList: payload };
    default:
      return state;
  }
};
