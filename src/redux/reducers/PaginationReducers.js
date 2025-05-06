import { PAGINATION_ERROR, PAGINATION_LOADING, PAGINATION_SUCCESS, RESET_PAGINATION, SET_CURRENT_PAGE, SET_HOME_LIST, SET_PAGE_SIZE, SET_PROGRAM } from "../../constants";

const initialState = {
    loading: false,
    currentPage: 1,
    pageSize: 50,
    totalItems: 0,
    totalPages: 0,
    record: [],
    programs: []
};

function paginationReducer(state = initialState, { type, payload }) {
    switch (type) {
        case PAGINATION_LOADING:
            return {
                ...state,
                loading: true,
            };
        case SET_HOME_LIST:
            return {
                ...state,
                loading: false,
                totalItems: payload.totalItems,
                totalPages: Math.ceil(payload.totalItems / state.pageSize),
            };
        case PAGINATION_ERROR:
            return {
                ...state,
                loading: false,
            };
        case SET_CURRENT_PAGE:
            return {
                ...state,
                loading: false,
                currentPage: payload.page,
                record: payload.record,
            };
        case SET_PAGE_SIZE:
            return {
                ...state,
                pageSize: payload.pageSize,
                currentPage: 1,
                record: payload.record,
                totalPages: Math.ceil(state.totalItems / payload.pageSize),
            };
        case SET_PROGRAM:
            return {
                ...state,
                programs: payload,
            };
        case RESET_PAGINATION:
            return initialState;
        default:
            return state;
    }
}

export default paginationReducer;