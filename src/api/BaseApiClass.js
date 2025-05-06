import { pull } from "./Fetch";

export default class BaseApiClass {
    constructor(baseUrl, username, password) {
        this.baseUrl = baseUrl || "../../..";
        this.username = username;
        this.password = password || "";
    }

    get = (endPoint, paging, params) =>
        pull(
            this.baseUrl,
            this.username,
            this.password,
            endPoint, paging, params
        )
}