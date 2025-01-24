export const MAIN_ACTION_TYPES = {

  SET_STATUS: 'SET_STATUS',

};

export const INITIAL_STATE = {

  status: false,

};

export const mainReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {

    case MAIN_ACTION_TYPES.SET_STATUS:
      return { ...state, status: payload };

    default:
      return state;
  }
};


