export const posOrNeg = (value = '') => {
    switch (value) {
        case "true": return "Positive"
        case "false": return "Negative"
        default: ''
    }
}
export const yesOrNo = (value = '') => {
    switch (value) {
        case "true": return "Yes"
        case "false": return "No"
        default: ''
    }
}