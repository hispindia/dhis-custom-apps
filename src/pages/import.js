import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Excel from 'exceljs';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function InputFileUpload() {
    const [file, setFiles] = useState('')

    function checkfile(e) {
        
        const file = e[0];
        const wb = new Excel.Workbook();
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const buffer = reader.result;
            wb.xlsx.load(buffer).then((workbook) => {
                console.log(workbook, 'workbook instance');
                workbook.eachSheet((sheet, id) => {
                    sheet.eachRow((row, rowIndex) => {
                        console.log(row.values, rowIndex);
                    });
                });
            });
        };

    }

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload file
            <VisuallyHiddenInput
                onChange={(e) => checkfile(e.target.files)}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                type="file" />
        </Button>
    );
}
