import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHomeReportWithPageNumber } from '../redux/actions/HomeActions';

export default function Pagination({ currentPage = 1, totalPages = 0, pages = [], loading = false }) {
    const dispatch = useDispatch();
    const { selectedProgram } = useSelector(state => state.common);
    const { serchedTxet } = useSelector(state => state.home);

    function onPageChange(page) {
        dispatch(fetchHomeReportWithPageNumber({ id: selectedProgram?.id, page, filter: serchedTxet }))
    }

    if (loading) return <div className='text-center' style={{ height: '80vw' }}><p>......loading......</p></div>
    if (!totalPages) return <div className='text-center'><p></p></div>

    return (
        <div style={{ justifySelf: "center" }}>
            <nav aria-label="Pagination">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>Previous</button>
                    </li>

                    {pages.map((page, index) =>
                        page === "..." ? (
                            <li key={index} className="page-item disabled">
                                <span className="page-link">…</span>
                            </li>
                        ) : (
                            <li key={index} className={`page-item ${page === currentPage ? "active" : ""}`}>
                                <button className="page-link" onClick={() => onPageChange(page)}>
                                    {page}
                                </button>
                            </li>
                        )
                    )}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
