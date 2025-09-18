import { MAIN_ACTION_TYPES } from "./main.reducer";

export const setDatasets = (dataSets) => ({
  type: MAIN_ACTION_TYPES.SET_DATASETS,
  payload: dataSets,
});
export const setPeriod = (period) => ({
  type: MAIN_ACTION_TYPES.SET_PERIOD,
  payload: period,
});
export const setSelectedDataset = (filteredDataSet) => ({
  type: MAIN_ACTION_TYPES.SET_SELECTED_DATASET,
  payload:filteredDataSet,
})
export const setStatus = (bool) => ({
  type: MAIN_ACTION_TYPES.SET_STATUS,
  payload:bool,
})
export const setUseSelectedUnitOnly = (bool) => ({
  type: MAIN_ACTION_TYPES.SET_USESELECTEDUNIT,
  payload:bool,
})