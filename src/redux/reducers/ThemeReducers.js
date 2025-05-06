import { SET_THEME } from "../../constants";

const initialState = {
    value: false
}

function themeReducer(state = initialState, { payload, type }) {
    switch (type) {
        case SET_THEME:
            return {
                ...state,
                value: payload
            }

            default:
                return state;
    }
}
export default themeReducer;