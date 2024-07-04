import React, { useState, useEffect } from "react";
import { ApiService } from '../../services/apiService';
import PeriodType from "../PeriodType";
import { setStatus } from "../../store/main/main.action";
import { CircularLoader } from "@dhis2/ui";
import { useDispatch, useSelector } from "react-redux";
const Main = () => {
    const [report, setReport] = useState(null);
    const [reportApp, setReportApp] = useState(null);
    const [loading, setLoading] = useState(false);
    const selectedOU = useSelector((state) => state.outree.clickedOU);
    const selectedPeriod = useSelector((state) => state.main.period);
    const SelectedRoute = useSelector((state) => state.sidebar?.Title?.text);
    const useSelectedUnitOnly = useSelector((state) => state.main?.useSelectedUnitOnly);
    const Status = useSelector((state) => state.main.status);
    const formattedPeriod = selectedPeriod?.length > 0 && selectedPeriod?.replace("-", "");
    const selectedOuID = selectedOU?.id;
    const selectedDataset = useSelector(
        (state) => state?.main?.selectedDataset
    );
    const ouChildrenIds = selectedOU?.children?.map((ou) => ou.id).join(";");
    const getDatasetId = () => {
        if (selectedDataset) {
            return selectedDataset;
        }
        return null;
    };
    console.log("selectedOU", selectedOU, selectedPeriod, formattedPeriod,)
    const fetchReport = async () => {
        setLoading(true)
        const datasetId = selectedDataset[0]?.id;
        try {

            const response = await ApiService.getReport(
                selectedOuID,
                datasetId,
                formattedPeriod,
                useSelectedUnitOnly

            );
            setReport(response);
        } catch (err) {
        }
        finally {
            setLoading(false);
        }
    };
    const getRateSummary = async () => {
        setLoading(true);
        const datasetId = selectedDataset[0]?.id;
        try {
            const response = await ApiService.getRateSummary(
                datasetId,
                selectedOuID,
                ouChildrenIds,
                formattedPeriod
            );
            setReportApp(JSON.parse(response));
        } catch (err) {
            console.error("Error fetching rate summary:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedOU && selectedPeriod && selectedDataset) {
            fetchReport();
        }

    }, [Status == true, SelectedRoute === "Data Set Report"]);
    useEffect(() => {
        console.log('selectedOuID && selectedDataset?.length && formattedPeriod', selectedOuID, selectedDataset, formattedPeriod)

        if (selectedOuID && selectedDataset?.length && formattedPeriod) {
            getRateSummary();
        }
    }, [Status == true, SelectedRoute == "Reporting Rate Summary"]);
    if (loading) {
        return <div className="h-100 d-flex align-items-center justify-content-center"><CircularLoader /></div>;
    }
    return (
        <>
            {(Status == true && SelectedRoute == "Data Set Report") ? (
                <div style={{marginTop:'10px',boxShadow:'0 4px 8px rgba(0, 0, 0, 0.1);',borderRadius:'8px',backgroundColor:'#fff'}} >
               
                    <iframe
                        srcDoc={report}
                        style={{ height: "92vh", width: "100vw" }}
                        sandbox="allow-same-origin allow-scripts allow-modals allow-downloads allow-popups"
                    ></iframe>
                </div>
            ) : (Status == true && SelectedRoute == "Reporting Rate Summary") ? (
                <div>
                    <h4>{selectedOU?.name}-{selectedDataset[0]?.name}-{reportApp?.title}</h4>
                    <table style={{ border: '1px solid black' }}>
                        <thead>
                            <tr style={{ border: '1px solid black' }}>
                                {reportApp?.metaData?.dimensions?.dx?.map(item => {
                                    // console.log("ITEM??????",item)
                                    return <th style={{ border: '1px solid black' }} key={item}>{item.replace(getDatasetId()[0]?.id + '.', ' - ' + getDatasetId()[0]?.name)}</th>
                                })}
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            ) : ''}
        </>
    )
}

export default Main
