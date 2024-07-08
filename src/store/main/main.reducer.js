export const MAIN_ACTION_TYPES = {
  SET_DATASETS: "SET_DATASETS",
  SET_PERIOD: "SET_PERIOD",
  SET_SELECTED_DATASET:'SET_SELECTED_DATASET',
  SET_STATUS:'SET_STATUS',
  SET_USESELECTEDUNIT:'SET_USESELECTEDUNIT'
  };
  
  export const INITIAL_STATE = {
    dataSetList: [],
    period: null,
    selectedDataset:'',
    status:false,
    useSelectedUnitOnly:false,
  };
  
  export const mainReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case MAIN_ACTION_TYPES.SET_DATASETS:
        return { ...state, dataSetList: payload };
        case MAIN_ACTION_TYPES.SET_PERIOD:
          return { ...state, period: payload,status:false };
          case MAIN_ACTION_TYPES.SET_SELECTED_DATASET:
        return { ...state, selectedDataset: payload, status:false };
        case MAIN_ACTION_TYPES.SET_STATUS:
          return { ...state, status: payload };
          case MAIN_ACTION_TYPES.SET_USESELECTEDUNIT:
            return { ...state, useSelectedUnitOnly: payload };
      default:
        return state;
    }
  };
  

 