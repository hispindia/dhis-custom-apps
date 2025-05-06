import React from 'react'
import { CunstomLoader } from "./Loader";
import { TableWrapperTD, TableWrapperTH, TableWrapperTR } from './wrapper/TableWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedText } from '../redux/actions/HomeActions';

const DynamicTable = ({ data = [], header = {}, loading = false, download = false, actionHeader = '', actionCallback = null, actionText = '', setSelectedRow = '', detailsCallBack = null }) => {
    const { serchedTxet, keyWithAttrubute } = useSelector(state => state.home);
    const dispatch = useDispatch();

    if (loading) return <CunstomLoader />

    // if (!data || data.length === 0) return <div className="text-center" style={{ height: '43vw' }}>
    //     <p>No data available</p>
    // </div>;

    console.log({ header })

    let headers = [];

    if (header) headers = Object.keys(header ?? {})
    else headers = Object.keys(data?.[0] ?? {}).filter(key => key !== 'id');

    // console.log({ headers })

    function handleSearch(event) {
        const { name, value } = event.target;
        const data = { ...serchedTxet, [keyWithAttrubute[name]]: value }
        if (value) {
            dispatch(setSearchedText(data))
        } else {
            delete data[keyWithAttrubute[name]]
            dispatch(setSearchedText(data))
        }
    }

    return (
        <div className="m-2 w-100 overflow-auto" id='report-table'>
            <a id="dlink"></a>

            <table className="table table-striped table-bordered" style={{ minHeight: "40vw" }} >
                <thead >
                    <TableWrapperTR>
                        {headers?.map((header, i) => {
                            const isLast = i === headers.length - 1;
                            return (
                                <React.Fragment key={header}>
                                    <TableWrapperTH>
                                        {header}
                                    </TableWrapperTH>
                                    {download && isLast && (
                                        <TableWrapperTH key={`${header}-action`} >
                                            {actionHeader}
                                        </TableWrapperTH>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </TableWrapperTR>

                    <TableWrapperTR>
                        {headers?.map((header) => {
                            return <TableWrapperTH key={header}>
                                <input
                                    onChange={handleSearch}
                                    value={serchedTxet[keyWithAttrubute[header]] ?? ''}
                                    key={header}
                                    name={header}
                                    style={{ width: "14rem" }}
                                    type="text"
                                    class="form-control"
                                    placeholder={`Search ${header}`} />
                            </TableWrapperTH>
                        })}
                    </TableWrapperTR>
                </thead>

                <tbody>
                    {data?.map((row, idx) => (
                        <TableWrapperTR key={idx}>
                            {headers.map((header, hIdx) => {
                                const isLast = hIdx === headers.length - 1;
                                return (
                                    <React.Fragment key={hIdx}>
                                        <TableWrapperTD
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedRow && setSelectedRow(row.id)
                                                detailsCallBack && detailsCallBack()
                                            }}>
                                            {row[header]}
                                        </TableWrapperTD>
                                        {download && isLast && (
                                            <TableWrapperTD key={`download-${idx}`}                                            >
                                                <button onClick={() => {
                                                    setSelectedRow && setSelectedRow(row.id)
                                                    actionCallback && actionCallback()
                                                }} type="button" className="btn btn-sm btn-success">
                                                    {actionText}
                                                </button>
                                            </TableWrapperTD>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </TableWrapperTR>
                    ))

                    }
                </tbody>


            </table>

            {!data.length ?

                <div className="text-center">
                    <p>No data available</p>
                </div> : ""
            }
        </div>
    );
};

export default DynamicTable;
