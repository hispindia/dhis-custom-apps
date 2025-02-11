export const MAIN_ACTION_TYPES = {
  SET_DATAELEMENTS: 'SET_DATAELEMENTS',
  SET_TAB:'SET_TAB',
  };
  
  export const INITIAL_STATE = {
    dataElements: [],
    tab:''
  };
  
  export const mainReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case MAIN_ACTION_TYPES.SET_DATAELEMENTS:
      return { ...state, dataElements: payload };
      case MAIN_ACTION_TYPES.SET_TAB:
        return { ...state, tab: payload };
        
      default:
        return state;
    }
  };
  

 