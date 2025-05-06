import React, { useEffect, useState } from 'react'
import ThemeButton from './ThemeButton'
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeReportData, collectAttributes, selectedProgram, setProgramList } from '../redux/actions/HomeActions';
import { tableToExcel } from '../utils/tableToexcel';

function Header() {
    const dispatch = useDispatch()
    const { serchedTxet } = useSelector(state => state.home);

    const { programs, record } = useSelector(state => state.pagination)
    const [programValue, setProgramValue] = useState({})

    const handleSelectChange = (e) => {
        const selectedValue = JSON.parse(e.target.value);
        setProgramValue(selectedValue);
    };

    const handleSearch = () => {
        if (!programValue?.id) return alert("Please select a program")
        dispatch(fetchHomeReportData({ id: programValue?.id, filter: serchedTxet }))
        dispatch(collectAttributes(programValue?.id))
        dispatch(selectedProgram(programValue))
    }

    useEffect(() => {
        dispatch(setProgramList())
    }, [])

    return (
        <>
            {/* <div className={themeValue ? classes["dark-mode"] : classes["light-mode"]}> */}

            <div class='mb-3 border-bottom border-danger py-2'>

                <div class="container">
                    <div class="row g-3 w-100">

                        <div class="col-2">
                            <ThemeButton />
                        </div>
                        <div class="col-6">
                            {programs?.length > 0 && (
                                <select class="form-select w-100" aria-label="Default select example" onChange={handleSelectChange}>
                                    <option value="">Select Program for Event List</option>
                                    {programs?.map((option) => (
                                        <option
                                            key={option[0]}
                                            value={JSON.stringify({ id: option[0], name: option[1] })}
                                        >
                                            {option[1]}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div class="col-2">
                            <button
                                type="button"
                                class="btn btn-secondary w-100"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>
                        <div class="col-2">
                            <button
                                disabled={!record.length}
                                type="button"
                                class="btn btn-success w-100"
                                onClick={() => tableToExcel("report-table", "Timor Event List")}
                            >
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* </div> */}
        </>
    )
}

export default Header