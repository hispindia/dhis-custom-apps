export const fetchBirthCertificateRecords = async(orgUnit, status) => {
    if(!orgUnit){
        throw new Error('Organization unit is required');
    }
    const url = `../../tracker/events.json?paging=false&program=cUjoGJK4gPL&orgUnit=${orgUnit}&filter=seXQ3F3kY3x:eq:${status}`;
    console.log('---------', url);
    const response = await fetch(url);
    if(!response.ok) throw new Error("Failed to fetch Birth Records");
    return response.json();

}


