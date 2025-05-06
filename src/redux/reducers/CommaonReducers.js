import { SET_SELETED_PROGRAM } from "../../constants";

const initialState = {
    selectedProgram: {}
}

function comminReducer(state = initialState, { payload, type }) {
    switch (type) {
        case SET_SELETED_PROGRAM:
            return {
                ...state,
                selectedProgram: payload
            }

        default:
            return state;
    }
}
export default comminReducer;