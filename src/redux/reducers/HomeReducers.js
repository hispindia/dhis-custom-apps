import { KEY_WITH_ATTRIBUTES, SEARCHED_TEXT, SET_EVENT_DATA, SET_PROGRAM_STAGES, STAGES_lOADING } from "../../constants";

const initialState = {
    loading: false,
    serchedTxet: {},
    keyWithAttrubute: {},
    programStages: [],
    eventData: []
}

function homeReducer(state = initialState, { payload, type }) {
    switch (type) {
        case STAGES_lOADING:
            return {
                ...state,
                loading: true
            }
        case SEARCHED_TEXT:
            return {
                ...state,
                serchedTxet: payload
            }
        case KEY_WITH_ATTRIBUTES:
            return {
                ...state,
                keyWithAttrubute: payload
            }

        case SET_PROGRAM_STAGES:
            return {
                ...state,
                loading: false,
                programStages: payload
            }

        case SET_EVENT_DATA:
            return {
                ...state,
                loading: false,
                eventData: payload
            }

        default:
            return state;
    }
}
export default homeReducer;