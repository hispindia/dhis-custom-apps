export class CalculateAge {
    constructor(dob) {
        this.dob = new Date(dob || new Date());
    }
    getAge() {
        const today = new Date();
        const age = today.getFullYear() - this.dob.getFullYear();
        const m = today.getMonth() - this.dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < this.dob.getDate())) {
            age--;
        }
        return age;
    }
}