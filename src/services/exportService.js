export class exportService {

    static fetchNational = async () => {
        const base_url = process.env.REACT_APP_DHIS2_BASE_URL
        const requestOptions = { method: 'GET' }
        let response = await fetch(base_url + "/api/29/organisationUnits.json?level=3&paging=false", requestOptions);
        return response.json();
    }
    static fetchSubNational = async () => {
        const base_url = process.env.REACT_APP_DHIS2_BASE_URL
        const requestOptions = { method: 'GET' }
        let response = await fetch(base_url + "/api/29/organisationUnitGroups/znpMvXHhbPX.json?fields=id,name,organisationUnits[id,name,path]", requestOptions);
        return response.json();
    }
}