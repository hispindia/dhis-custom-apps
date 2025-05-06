import { KEY_WITH_ATTRIBUTES, PAGINATION_LOADING, SEARCHED_TEXT, SET_CURRENT_PAGE, SET_EVENT_DATA, SET_HOME_LIST, SET_PAGE_SIZE, SET_PROGRAM, SET_PROGRAM_STAGES, SET_SELETED_PROGRAM, STAGES_lOADING } from "../../constants";
import { OPDService } from "../../Services/api";
import { destrictureHomeList } from "../../utils/DestructureResponse";
import { createAction } from "./CreateActions";

export const setProgramList = () => async dispatch => {
    const programResponse = await OPDService.Programoptions();
    dispatch(createAction(SET_PROGRAM, programResponse?.listGrid?.rows || []))
}

export const fetchHomeReportData = ({ id, page = 1, filter }) => async dispatch => {
    dispatch(createAction(PAGINATION_LOADING, true))

    const response = await OPDService.tableDataplot({ id, page, filter });
    console.log({ response });

    if (response.status != "ERROR") {

        const data = destrictureHomeList(response.instances);

        const list = {
            pageSize: response.pageSize,
            totalItems: response.total,
        }

        const setPageSize = {
            pageSize: response.pageSize,
            record: data,

        }
        dispatch(createAction(SET_PAGE_SIZE, setPageSize));

        dispatch(createAction(SET_HOME_LIST, list));

    }
}
export const fetchHomeReportWithPageNumber = ({ id, page = 1, filter }) => async dispatch => {

    dispatch(createAction(PAGINATION_LOADING, true))

    const response = await OPDService.tableDataplot({ id, page, filter });
    console.log({ response });

    if (response.status != "ERROR") {
        const data = destrictureHomeList(response.instances)

        const setCurrentPageSIze = {
            pageSize: response.pageSize,
            record: data,
            page: response.page,

        }
        dispatch(createAction(SET_CURRENT_PAGE, setCurrentPageSIze));
    }
}

export const selectedProgram = (id) => dispatch => {
    dispatch(createAction(SET_SELETED_PROGRAM, id))
}

export const setSearchedText = (value) => dispatch => {
    dispatch(createAction(SEARCHED_TEXT, value))
}
export const fetchProgramStages = () => async dispatch => {
    dispatch(createAction(STAGES_lOADING, true))

    const response = await OPDService.ProgramStages();
    if (response.status != "ERROR") {

        const stages = response?.programStages?.reduce((acc, item) => {
            acc[item.id] = item.name
            return acc
        }, {});

        dispatch(createAction(SET_PROGRAM_STAGES, stages))
    }
}

export const fetchProgramEvents = (pId, tIid) => async dispatch => {

    dispatch(createAction(STAGES_lOADING, true))

    const response = await OPDService.EventAPi(pId, tIid);
    if (response.status != "ERROR") {
        dispatch(createAction(SET_EVENT_DATA, response))
    }
}

export const collectAttributes = (id) => async dispatch => {
    const response = await OPDService.collectAttributes(id);
    if (response.status != "ERROR") {
        const res = response.programTrackedEntityAttributes
        let keyAttr = {}
        for (const key in res) {
            keyAttr[res[key]["trackedEntityAttribute"]["name"]] = res[key]["trackedEntityAttribute"]["id"]
        }
        dispatch(createAction(KEY_WITH_ATTRIBUTES, keyAttr));
    }
}

export const AllDataelement = async() => {
    const response = await OPDService.AllDataelement();
    const de = response?.dataElements?.reduce((acc, item) => {
        acc[item.id] = item.name
        return acc
    }, {});
    return de;
}