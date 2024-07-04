export const OUTREE_ACTION_TYPES = {
  SET_OU_LIST: "SET_OU_LIST",
  SET_USER_OU: "SET_USER_OU",
  SET_CLICKED_OU: "SET_CLICKED_OU",
  SET_SELECTED_OU: "SET_SELECTED_OU",
  SET_FILTERED_OU: "SET_FILTERED_OU",
  SET_SEARCHED_OU: "SET_SEARCHED_OU",
  SET_SEARCHED_OU_LIST: "SET_SEARCHED_OU_LIST"
};

export const INITIAL_STATE = {
  userOU: null,
  clickedOU: null,
  ouList: null,
  filteredOU: "",
  searchedOU: "",
  searchedOUList: [],
};

export const outreeReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case OUTREE_ACTION_TYPES.SET_USER_OU:
      return { ...state, userOU: payload };
    case OUTREE_ACTION_TYPES.SET_CLICKED_OU:
      return { ...state, clickedOU: payload };
    case OUTREE_ACTION_TYPES.SET_OU_LIST:
      return { ...state, ouList: payload };
    case OUTREE_ACTION_TYPES.SET_FILTERED_OU:
      return { ...state, filteredOU: payload };
    case OUTREE_ACTION_TYPES.SET_SEARCHED_OU:
      return { ...state, searchedOU: payload };
    case OUTREE_ACTION_TYPES.SET_SEARCHED_OU_LIST:
      return { ...state, searchedOUList: payload };
    default:
      return state;
  }
};
