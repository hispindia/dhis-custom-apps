export const MAIN_ACTION_TYPES = {
  SET_STATUS: 'SET_STATUS'
};
export const INITIAL_STATE = {
  status: false
};
export const mainReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    type,
    payload
  } = action;
  switch (type) {
    case MAIN_ACTION_TYPES.SET_STATUS:
      return {
        ...state,
        status: payload
      };
    default:
      return state;
  }
};