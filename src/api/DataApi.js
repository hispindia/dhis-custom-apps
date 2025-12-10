import get from './fetch';

export default class DataApi {

  constructor(baseUrl, username, password) {
    this.baseUrl = baseUrl;
    this.username = username,
    this.password = password;
  }

  fetchEvents = (param, paging) => {
    const endPoint = '/api/tracker/events.json';
    return get(this.baseUrl, this.username, this.password, endPoint, param, paging);
  }
  
  fetchOrgUnits = (param, paging) => {
    const endPoint = '/api/organisationUnits.json';
    return get(this.baseUrl, this.username, this.password, endPoint, param, paging);
  }

  fetchOthers = (endPoint, param, paging)  => {
    return get(this.baseUrl, this.username, this.password, endPoint, param, paging);
  }
}
