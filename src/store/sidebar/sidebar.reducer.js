export const SIDEBAR_ACTION_TYPES = {
  SET_TITLE: "SET_TITLE",


};

export const INITIAL_STATE = {
  Title : {href: '#/data-set-report', text: 'Data Set Report'},

};

export const sidebarReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case SIDEBAR_ACTION_TYPES.SET_TITLE:
      return { ...state, Title: payload };

    default:
      return state;
  }
};

