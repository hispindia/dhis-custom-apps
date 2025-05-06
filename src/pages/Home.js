import React, { useEffect, useMemo, useState } from 'react'
import DynamicTable from '../components/Table'
import { useDispatch, useSelector } from 'react-redux'
import { getPageNumbers } from '../utils/DestructureResponse'
import Pagination from '../components/Pagination'
import ModelComponent from '../common/Modal/Model.component'
import { downloadPDF } from '../export/export'
import TbTreatmentCard from '../report/TBTreatmentCard'
import ThemeWrapper from '../components/wrapper/ThemeWrapper'
import Header from "../components/Header"
import { fetchProgramEvents, fetchProgramStages } from '../redux/actions/HomeActions'
import RowViews from '../report/RowViews'

export default function Home() {
  const dispatch = useDispatch();

  const { record, currentPage, pageSize, totalPages, loading } = useSelector(state => state.pagination)
  const pages = useMemo(() => getPageNumbers(totalPages, currentPage), [currentPage, totalPages]);
  const { selectedProgram } = useSelector(state => state.common);
  const { keyWithAttrubute } = useSelector(state => state.home);

  const [downloadOpen, setDownloadOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selecedRow, setSelectedRow] = useState('')

  console.log({selecedRow, detailsOpen})

  useEffect(() => {
    if (detailsOpen) {
      dispatch(fetchProgramStages())
      dispatch(fetchProgramEvents(selectedProgram?.id, selecedRow))
    }
  }, [detailsOpen])

  return (
    <>

      <ThemeWrapper>


        {/* start TB tratment card */}
        <ModelComponent
          setOpen={setDownloadOpen}
          title='TB Treatment Card Report'
          actionFunctionCallBack={() => downloadPDF("printing")}
          actionType='Download'
          open={downloadOpen}>

          <TbTreatmentCard
            tie={selecedRow}
            pId={selectedProgram?.id}
          />
        </ModelComponent>

        {/* end Tbtreatment card */}

        {/* start views details of rows */}


        <ModelComponent
          setOpen={setDetailsOpen}
          title='Details'
          actionFunctionCallBack={() => null}
          open={detailsOpen}>

            <RowViews />
            
        </ModelComponent>
        {/* end views details of rows */}



        <Header />

        <DynamicTable
          actionHeader='Download TB Treatment Card'
          actionText='View Report'
          actionCallback={() => setDownloadOpen(true)}
          download={true}
          data={record}
          header={keyWithAttrubute}
          loading={loading}
          detailsCallBack={() => setDetailsOpen(true)}
          setSelectedRow={setSelectedRow}
        />

        <Pagination
          currentPage={currentPage}
          pages={pages}
          totalPages={totalPages}
          loading={loading}
        />

      </ThemeWrapper>

    </>
  )
}
