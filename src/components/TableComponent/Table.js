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
export default ({ tableObject, setShowDeleteModal }) => {
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
      },
    },
  }

  const _totalNumberOfRowsAndColumns = () => {
    setNumberOfColumns(tableObject?.length)
    setNumberOfRows(tableObject?.values?.length)
  }

  const _setTableHeaders = () => {
    const tableColumns = []
    tableObject?.map((column, index) => {
      const tempColumnName = column.column_name
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
    const tableData = tableObject
    const finalTableData = []
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
      {tableObject != {} && (
        <div className="ml-auto mt-4">
          <i className="fa-solid fa-pen-to-square mr-2"></i>
          <i
            className="fa-solid fa-trash ml-2"
            onClick={() => {
              setShowDeleteModal(true)
            }}
          ></i>
        </div>
      )}
      <div className="border w-100">
        <DataTable
          pagination={false}
          paginationPerPage={false}
          fixedHeader
          columns={tableHeader}
          data={tableRows}
          customStyles={customStyles}
          // conditionalRowStyles={conditionalRowStyles}
          // selectableRows
          // onSelectedRowsChange={selectedRowsActionUA}
        />
      </div>
    </>
  )
}
