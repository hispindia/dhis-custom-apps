import { exportService } from "../services/exportService";


export const exportAction = async () => {
    let nationalRes = await exportService.fetchNational();
    let subNationalRes = await exportService.fetchSubNational();

    nationalRes = nationalRes?.organisationUnits
    subNationalRes = subNationalRes?.organisationUnits

    for (const nation of nationalRes) {
        let extractCountry = []
        for (const subNation of subNationalRes) {
            if (subNation.path.includes(nation.id)) {
                extractCountry.push(subNation)
            }
        }
        nation.child = extractCountry
        extractCountry = []
    }
    return nationalRes
}

export function getYear(currentYear) {
    let arrYear = [];
    for (let i = 2000; i <= currentYear; i++) arrYear.push(i);
    return arrYear;
}