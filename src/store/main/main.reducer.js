export const MAIN_ACTION_TYPES = {
  SET_DATAELEMENTS: 'SET_DATAELEMENTS',
  };
  
  export const INITIAL_STATE = {
    dataElements: [],
  };
  
  export const mainReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case MAIN_ACTION_TYPES.SET_DATAELEMENTS:
      return { ...state, dataElements: payload };
        
      default:
        return state;
    }
  };
  

 