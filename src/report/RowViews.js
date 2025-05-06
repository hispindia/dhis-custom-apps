import React, { useEffect, useState } from 'react'
import { TableWrapperTD, TableWrapperTR } from '../components/wrapper/TableWrapper'
import { useSelector } from 'react-redux';
import { CunstomLoader } from '../components/Loader';
import { AllDataelement } from '../redux/actions/HomeActions';

function RowViews() {
    const { selectedProgram } = useSelector(state => state.common);
    const { programStages, eventData, loading } = useSelector(state => state.home);
    const [dataElements, setDataElements] = useState({})

    const getNameProgameStage = (id) => {
        return programStages[id] ? programStages[id] : "Unknown";
    };
    const getNameDataElement = (id) => {
        return dataElements[id] ? dataElements[id] : "Unknown";
    };

    useEffect(() => {
        (async () => {
            const res = await AllDataelement()
            setDataElements(res)
        })()
    }, [])

    if (loading) return <CunstomLoader />


    return (
        <div>
            <table className="table table-striped table-bordered">
                <tbody>
                    <TableWrapperTR>
                        <TableWrapperTD style={{ textAlign: "left" }} >Selected Program</TableWrapperTD>
                        <TableWrapperTD style={{ textAlign: "left" }}>{selectedProgram?.name || ''}</TableWrapperTD>
                    </TableWrapperTR>
                    {eventData?.events?.map((event, index) => {
                        return <>
                            <TableWrapperTR>
                                <TableWrapperTD style={{ textAlign: "left" }}>Program Stage</TableWrapperTD>
                                <TableWrapperTD style={{ textAlign: "left" }}> {getNameProgameStage(event?.programStage)}</TableWrapperTD>
                            </TableWrapperTR>
                            <TableWrapperTR>
                                <TableWrapperTD style={{ textAlign: "left" }}>Event Date</TableWrapperTD>
                                <TableWrapperTD style={{ textAlign: "left" }}>{event.eventDate ? event.eventDate.split("T")[0] : ""}</TableWrapperTD>
                            </TableWrapperTR>
                            <TableWrapperTR>
                                <TableWrapperTD style={{ textAlign: "left" }}>Status</TableWrapperTD>
                                <TableWrapperTD style={{ textAlign: "left" }}>{event.status}</TableWrapperTD>
                            </TableWrapperTR>

                            {event?.dataValues?.length > 0 && <TableWrapperTR>
                                <TableWrapperTD style={{ textAlign: "left" }}>DataElements</TableWrapperTD>
                                <TableWrapperTD style={{ textAlign: "left" }}></TableWrapperTD>
                            </TableWrapperTR>}

                            {event?.dataValues?.map((dataValue, idx) => {
                                return <TableWrapperTR>
                                    <TableWrapperTD style={{ textAlign: "left" }}>{getNameDataElement(dataValue?.dataElement)}:</TableWrapperTD>
                                    <TableWrapperTD style={{ textAlign: "left" }}>{dataValue.value === "true"
                                        ? "YES"
                                        : dataValue.value === "false"
                                            ? "NO"
                                            : dataValue.value}</TableWrapperTD>
                                </TableWrapperTR>
                            })}

                        </>
                    })}

                </tbody>
            </table>
        </div>
    )
}

export default RowViews