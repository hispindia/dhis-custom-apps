export const fetchDeathRecords = async() => {
    const response = await fetch("https://links.hispindia.org/myr_registry/api/analytics/events/query/TXuxHniKS6l.json?dimension=ou%3ARZjIN6Adcdr&dimension=FL9N3yXzucT.nQy5xQrOMXj&dimension=FL9N3yXzucT.wxrDsUO1ELy&dimension=FL9N3yXzucT.KFGxB6wpRxi&dimension=FL9N3yXzucT.jGGNvNYhu47&dimension=FL9N3yXzucT.aTbE3kYe98D&dimension=FL9N3yXzucT.iXXvJAxbOtd&outputType=EVENT&stage=FL9N3yXzucT&eventDate=THIS_YEAR%2CLAST_YEAR&headers=eventdate%2Couname%2CFL9N3yXzucT.nQy5xQrOMXj%2CFL9N3yXzucT.wxrDsUO1ELy%2CFL9N3yXzucT.KFGxB6wpRxi%2CFL9N3yXzucT.jGGNvNYhu47%2CFL9N3yXzucT.aTbE3kYe98D%2CFL9N3yXzucT.iXXvJAxbOtd&paging=false&outputIdScheme=UID");
    if(!response.ok) throw new Error("Failed to fetch death records");
    return response.json();
}