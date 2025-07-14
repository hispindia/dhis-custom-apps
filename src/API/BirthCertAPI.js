export const fetchBirthCertificateRecords = async(orgUnit, status) => {
    const response = await fetch(`../../tracker/events.json?paging=false&program=cUjoGJK4gPL&orgUnit=${orgUnit}&filter=seXQ3F3kY3x:eq:${status}`);
    if(!response.ok) throw new Error("Failed to fetch Birth Records");
    return response.json();

}


