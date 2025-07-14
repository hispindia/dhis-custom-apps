export const fetchDeathCertficateRecords = async(orgUnit) => {
    const response = await fetch(`../../tracker/events.json?paging=false&program=TXuxHniKS6l&orgUnit=${orgUnit}`);
    if(!response.ok) throw new Error("Failed to fetch death records");
    return response.json();
}