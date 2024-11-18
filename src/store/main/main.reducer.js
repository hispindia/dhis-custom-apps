export const MAIN_ACTION_TYPES = {
  SET_PROGRAM_ID: "SET_PROGRAM_ID",
  SET_STATUS: "SET_STATUS",
  SET_TRANSFER_STATUS: "SET_TRANSFER_STATUS"
};

export const INITIAL_STATE = {
  status: false,
  programId: "bASezt1TUKD",
  transferStatus: "YbTcQOcjrVO-From"
};

export const mainReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case MAIN_ACTION_TYPES.SET_PROGRAM_ID:
      return { ...state, programId: payload, status: false };
    case MAIN_ACTION_TYPES.SET_TRANSFER_STATUS:
      return { ...state, transferStatus: payload, status: false };
    case MAIN_ACTION_TYPES.SET_STATUS:
      return { ...state, status: payload };
    default:
      return state;
  }
};
