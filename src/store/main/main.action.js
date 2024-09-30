import { MAIN_ACTION_TYPES } from "./main.reducer";

export const setProgramId = (id) => ({
  type: MAIN_ACTION_TYPES.SET_PROGRAM_ID,
  payload: id,
});

export const setTransferStatus = (name) => ({
  type: MAIN_ACTION_TYPES.SET_TRANSFER_STATUS,
  payload: name,
});

export const setStatus = (bool) => ({
  type: MAIN_ACTION_TYPES.SET_STATUS,
  payload: bool,
});
