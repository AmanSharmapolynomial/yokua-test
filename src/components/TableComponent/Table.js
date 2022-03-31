import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'

/**
 *
 * @param tableObject : { id, table_name, category_name, order, is_archived, type, table_data: [
 *   {
 *                      id,
                        column_name,
                        is_sortable,
                        is_link,
                        is_filterable,
                        is_date,
                        table_id,
                        values: [{
                                 "id": 35,
                                "column_name": "Column1",
                                "row_index": 1,
                                "value": "value 1",
                                "table_id": 12
                                }
                        ]
 *   }
 * ]}
 *
 */
export default ({ tableObject }) => {
  const [tableRows, setTableRows] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [numberOfColumns, setNumberOfColumns] = useState(0)
  const [numberOfRows, setNumberOfRows] = useState(0)
  const customStyles = {
    rows: {
      style: {
        borderWidth: '10px',
        borderBottomColor: 'black',
        borderBottomWidth: '10px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        backgroundColor: 'var(--bgColor2)',
        color: 'white',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
        fontSize: '0.8rem',
        borderBottomStyle: 'solid',
        borderBottomColor: 'black',
        borderBottomWidth: '1px',
      },
    },
  }

  const _totalNumberOfRowsAndColumns = () => {
    setNumberOfColumns(tableObject?.table_data?.length)
    setNumberOfRows(tableObject?.table_data?.values?.length)
  }

  const _setTableHeaders = () => {
    const tableColumns = []
    tableObject.table_data?.map((column, index) => {
      const tempColumnName = column.column_name
      debugger
      tableColumns.push({
        name: column.column_name,
        selector: row => row[tempColumnName],
        sortable: column.is_sortable,
        isLink: column.is_link,
        isDate: column.is_date,
        filterable: column.is_filterable,
      })
    })
    console.log(tableColumns)
    setTableHeader([...tableColumns])
  }

  const _setTableData = () => {
    const tableData = tableObject.table_data
    const finalTableData = []
    console.log(tableData)
    debugger
    tableData &&
      tableData[0]?.values?.map((item, index) => {
        const tableRowObject = {
          id: item.id,
        }

        tableData?.map((tableC, tableI) => {
          const tempObject = new Object()
          tempObject[tableC['column_name']] = tableC.values[index].value
          Object.assign(tableRowObject, tempObject)
        })
        finalTableData.push(tableRowObject)
      })
    console.log(finalTableData)
    setTableRows([...finalTableData])
  }

  useEffect(() => {
    if (tableObject != {}) {
      _setTableHeaders()
      _setTableData()
    }
  }, [tableObject])

  return (

    <>
      <div className='position-absolute text-primary' style={{zIndex:"4", right:"0", marginTop:"-36px",}}>
        <i className="fa-solid fa-pen-to-square" ></i>
        <i className="fa-solid fa-trash"></i>
      </div>

      <DataTable
        pagination
        fixedHeader
        columns={tableHeader}
        data={tableRows}
        customStyles={customStyles}
      // conditionalRowStyles={conditionalRowStyles}
      // selectableRows
      // onSelectedRowsChange={selectedRowsActionUA}
      />
    </>
  )
}
