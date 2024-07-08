import React, { useState, useEffect } from "react";
import { CircularLoader } from "@dhis2/ui";
import { useSelector } from "react-redux";
import { ApiService } from "../../services/apiService";
import { tableToExcel } from '../../utils/download'
const Report = ({ head }) => {
    const [report, setReport] = useState(null);
    const [reportApp, setReportApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const selectedOU = useSelector((state) => state.outree.clickedOU);
    const selectedPeriod = useSelector((state) => state.main.period);
    const useSelectedUnitOnly = useSelector((state) => state.main.useSelectedUnitOnly);
    const dataSetList = useSelector((state) => state.main.dataSetList);
    const selectedDataset = useSelector( (state) => state.main.selectedDataset);
    const ouChildrenIds = selectedOU?.children?.map((ou) => ou.id).join(";");
    const dataSet = (dataSetList.length && selectedDataset) ? dataSetList.find(list => list.id == selectedDataset) : '';
    const fetchReport = async () => {
        const response = await ApiService.getReport(
            selectedOU.id,
            selectedDataset,
            selectedPeriod.split('-').join(''),
            useSelectedUnitOnly
        );
        setReport(response);
    };
    const getRateSummary = async () => {
        const response = await ApiService.getRateSummary(
            selectedDataset,
            selectedOU.id,
            ouChildrenIds,
            selectedPeriod.split('-').join(''),
        );
        setReportApp(JSON.parse(response));
    };

    useEffect(() => {
        const fetchList = async () => {
            if (selectedOU?.id && selectedPeriod && selectedDataset) {
                if (head) await fetchReport();

                else if (!head) await getRateSummary();
                setLoading(false);
            }
        }
        fetchList()
    }, []);
    const tableHeaders = reportApp?.metaData?.dimensions?.dx?.map(item => (
        <th style={{ border: '1px solid black' }} key={item}>
            {item.replace(dataSet?.id + '.', ' - ' + dataSet?.name)}
        </th>
    ));

    const tableRows = reportApp?.rows?.map((row, index) => (
        <tr key={index} style={{ border: '1px solid black' }}>

            <td style={{ border: '1px solid black' }}>{row[4]}</td>
            <td style={{ border: '1px solid black' }}>{row[5]}</td>
            <td style={{ border: '1px solid black' }}>{row[6]}</td>
            <td style={{ border: '1px solid black' }}>{row[7]}</td>
            <td style={{ border: '1px solid black' }}>{row[8]}</td>
        </tr>
    ));

    if (loading) {
        return <div className="h-100 d-flex align-items-center justify-content-center"><CircularLoader /></div>;
    }

    return (
        <>
            <button
                style={{ backgroundColor: '#1976D2', marginLeft: '8px', marginTop: '10px', marginRight: '10px', color: 'white' }}
                onClick={() =>
                    tableToExcel(
                        head ? 'html-report-id' : 'Reporting-Rate-Summary-id',
                        head ? 'dataSetReport' : 'Reporting',
                        head ? 'dataSetReport.xls' : 'Reporting.xls', head
                    )
                }
            >
                DOWNLOAD AS XLS
            </button>

            {head ? (
                <div style={{ marginTop: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1);', borderRadius: '8px', backgroundColor: '#fff' }} >

                    <iframe
                        id="html-report-id"
                        srcDoc={report}
                        style={{ height: "92vh", width: "85vw" }}
                        sandbox="allow-same-origin allow-scripts allow-modals allow-downloads allow-popups"

                    ></iframe>
                </div>) : (
                <div id="Reporting-Rate-Summary-id" className="box p-3 w-100" >
                    <h4 className="text-center py-2">{selectedOU?.name}-{dataSet?.name}-{reportApp?.title}</h4>
                    <table style={{ border: '1px solid black' }}>
                        <thead>
                            <tr style={{ border: '1px solid black' }}>
                                {/* {reportApp?.metaData?.dimensions?.dx?.map(item => {
                                        return <th style={{ border: '1px solid black' }} key={item}>{item.replace(dataSet?.id + '.', ' - ' + dataSet?.name)}</th>
                                    })} */}
                                {tableHeaders}
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows}
                        </tbody>
                    </table>

                </div>
            )
            }
        </>
    )

}

export default Report
