import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, Card, Grid, Typography } from '@mui/material';
import './export.css'
import { exportAction, getYear } from '../actions/exportAction';
import { makeStyles } from '@mui/styles';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const region = ['Country', 'Subnational', 'Org unit ID', 'Age group', 'ID']

const useStyles = makeStyles({
    root: {
        '& .MuiDataGrid-cell': {
            border: '1px solid #ccc', // Add border to cells
            background: 'white',
            fontSize: '12px'
        },
    },
    card: {
        minHeight: '70vh'
    },
    typo: {
        textAlign: 'center',
        paddingTop: '12%'
    }
});

export default function Exports() {
    const classes = useStyles();

    const [filter, setFilter] = useState({ period: [], country: [] })
    const [selectedFilter, setSelectedFilter] = useState({ period: '', country: {} })
    const [data, setData] = useState({ columns: [], rows: [] })

    useEffect(async () => {
        const d = new Date();
        let currentYear = d.getFullYear();

        const country=await exportAction()
        
        setFilter({
            country: country,
            period: getYear(currentYear)
        })
    }, [])

    useEffect(() => {
        CreateDynamicRow()
    }, [selectedFilter]);


    function CreateDynamicRow() {
        let { period, country } = selectedFilter
        period = [...region, ...period]

        const rows = [];

        for (let i = 0; i < country?.child?.length * 2; i += 1) {
            const row = {
                id: i,
            };

            for (const colum in period) {
                if (colum < 5) {
                    if (colum == 0 && i == 0) row[' ' + period[colum]] = country?.displayName;
                    if (colum == 1 && i % 2 == 0) row[' ' + period[colum]] = country?.child[i / 2]?.name;
                    if (colum == 2 && i % 2 == 0) row[' ' + period[colum]] = country?.child[i / 2]?.id;
                    if (colum == 3 && i % 2 == 0) row[' ' + period[colum]] = 'Children';
                    if (colum == 3 && i % 2 != 0) row[' ' + period[colum]] = 'Adult';
                    if (colum == 3 && i % 2 != 0) row[' ' + period[colum]] = 'Adult';
                    if (colum == 4 && i % 2 == 0) row[' ' + period[colum]] = 'SmZe6komFZU-HllvX50cXC0';
                    if (colum == 4 && i % 2 != 0) row[' ' + period[colum]] = 'vrltiuqfmsj-HllvX50cXC0';
                }
                else row[' ' + period[colum]] = ` `;
            }

            rows.push(row);
        }

        const columns = [];

        for (const colum of period) {
            columns.push({ field: ' ' + colum.toString(), headerName: colum, editable: region.includes(colum) ? false : true, width: colum == region[region.length - 1] ? 200 : 100 });
        }

        setData({
            rows,
            columns,
        });

        return data;
    }

    const handleExport = () => {
        const dataWithoutId = data.rows.map(({ id, ...rest }) => rest);

        const worksheet = XLSX.utils.json_to_sheet(dataWithoutId);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataFile = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataFile, 'DataGridExport.xlsx');
    };

    const handleCellEditCommit = (params) => {
        const updatedRows = data.rows.map((row) => {
            if (row.id == params.id) return params
            else return row
        });
        setData({ ...data, rows: updatedRows });
    };

    return (
        <React.Fragment>

            <Card style={{ marginBottom: '10px', padding: '10px' }}>
                <Grid container gap={3} >
                    <Grid xs={2}>
                        <Autocomplete
                            disablePortal
                            disableClearable
                            id="combo-box-demo"
                            options={filter?.country ?? []}
                            getOptionLabel={(options) => options?.displayName}
                            size='small'
                            onChange={(e, v) => setSelectedFilter({
                                ...selectedFilter,
                                country: v
                            })}
                            renderInput={(params) => <TextField {...params} label="Select Country" />}
                        />
                    </Grid>
                    <Grid xs={2}>
                        <Autocomplete
                            disablePortal
                            disableClearable
                            id="combo-box-demo"
                            options={filter?.period ?? []}
                            size='small'
                            getOptionLabel={(key) => key.toString()}
                            onChange={(e, v) => setSelectedFilter({
                                ...selectedFilter,
                                period: getYear(+v)
                            })}
                            renderInput={(params) => <TextField {...params} label="Select Periods" />}
                        />
                    </Grid>

                    <Grid xs={2}>
                        <Button disabled={data.columns.length == 5 || data.rows.length == 0}
                            variant="contained" color='secondary' onClick={() => handleExport('report-table', 'Worklist')}>Export</Button>
                    </Grid>

                </Grid>
            </Card>

            <Card className={classes.card} >
                {data.columns.length == 5 || data.rows.length == 0 ?
                    <Typography variant="h5" gutterBottom className={classes.typo}>
                        'No Filter Selected'
                    </Typography>
                    :
                    <div id='report-table'>
                        <DataGrid
                            rowHeight={25}
                            headerHeight={40}
                            className={classes.root}
                            editMode='row'
                            hideFooterPagination={true}
                            hideFooter={true}
                            {...data}
                            disableColumnMenu={true}
                            disableColumnFilter={true}
                            processRowUpdate={(params) => handleCellEditCommit(params)}
                            onCellKeyDown={(e) => console.log(e)}
                        />
                    </div>
                }
            </Card>

        </React.Fragment>

    )
}
