import DataApi from "./DataApi";

const { VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD } = import.meta.env;

const dataApi = new DataApi(VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD);

export default dataApi;