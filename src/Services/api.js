export class OPDService {

    static EventAPi = async (selectedProgramValue, show) => {
        const requestOptions = {
            method: 'GET',
           
        }
        let response = await fetch(`../../events.json?skipPaging=true&program=${selectedProgramValue}&trackedEntityInstance=${show.id}&fields=dataValues[dataElement,value],eventDate,programStage,status`, requestOptions)
        return response.json();
    }
    // static patientSMSnotify = async (body) => {
    //     const { data } = await geneateABDMToken();
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${data.accessToken}`,
    //             'X-CM-ID': 'sbx'
    //         },
    //         body: JSON.stringify(body)
    //     }
    //     let response = await fetch(PROXY_SERVER + ABDM_TOKEN_URL + "/patients/sms/notify2", requestOptions)
    //     return response
    // }
    static ProgramStages = async () => {
        const requestOptions = {
            method: 'GET',
           
        }
        let response = await fetch(`../../programStages.json?paging=false&fields=id,name`, requestOptions)
        return response.json();
    }
    static AllDataelement = async () => {
        const requestOptions = {
            method: 'GET',
           
        }
        let response = await fetch(`../../dataElements.json?paging=false&domainType=TRACKER&fields=id,name`, requestOptions)
        return response.json();
    }

    static Programoptions = async () => {
        const requestOptions = {
            method: 'GET',
           
        }
        let response = await fetch(`../../29/sqlViews/oZAXWFlZgI7/data?paging=false`, requestOptions)
        return response.json();
    }
    static tableDataplot = async (selectedProgramValue) => {
        const requestOptions = {
            method: 'GET',
           
        }
        let response = await fetch(`../../trackedEntityInstances.json?ou=Fn51zf6ifbm&program=${
        encodeURIComponent(selectedProgramValue) }&ouMode=DESCENDANTS`, requestOptions)
        return response.json();
    }
    static tableHeaderData = async (selectedProgramValue) => {
        const requestOptions = {
            method: 'GET',
           
        }
        let response = await fetch(`../../programs/${selectedProgramValue}.json?fields=programTrackedEntityAttributes%5BtrackedEntityAttribute%5Bid,name,formName,attributeValues%5Battribute%5Bid,name,code%5D,value%5D%5D%5D`, requestOptions)
        return response.json();
    }


    //working on this api........
    static trackedEntityInstances = async (selectedProgramValue) => {
        const requestOptions = {
            method: 'GET',
        };
    
        let response = await fetch(`../../trackedEntityInstances/t8hYOJDA2Od.json?program=${selectedProgramValue}`, requestOptions);
        return response.json();

        
    };
    
  
}










