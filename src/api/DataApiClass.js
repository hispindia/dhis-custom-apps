import BaseApiClass from "./BaseApiClass";
import { pull } from "./Fetch";

export default class DataApiClass extends BaseApiClass {
    constructor(...args) {
        super(...args)
        this.this = this;
    }

    getHomeRecord = () =>
        pull()

}