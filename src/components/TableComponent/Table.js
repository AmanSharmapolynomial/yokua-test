import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { getUserRoles } from '../../utils/token'
import Plusicon from '../../assets/Group 331.png'
import API from '../../../src/utils/api'
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
  const [needToReload, setNeedToReload] = useState(0)

  const [emptyNewRow, setEmptyNewRow] = useState({})
  let [rowName, setRowName] = useState({})
  const [isEdit, setEdit] = useState(false)
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

  function handleChange(name, value) {
    const updatedRowName = rowName
    updatedRowName[name] = value
    setRowName({ ...updatedRowName })
  }

  const _totalNumberOfRowsAndColumns = () => {
    setNumberOfColumns(tableObject?.table_data?.length)
    setNumberOfRows(tableObject?.table_data?.values?.length)
  }

  const _setTableHeaders = () => {
    const tableColumns = []
    tableObject.table_data?.map((column, index) => {
      const tempColumnName = column.column_name
      tableColumns.push({
        isEdit: isEdit,
        name: column.column_name,
        selector: row => row[tempColumnName],
        sortable: column.is_sortable,
        isLink: column.is_link,
        isDate: column.is_date,
        filterable: column.is_filterable,
      })
    })
    console.log(tableColumns)
    tableColumns.push({
      name: '',
      selector: row => row.edit,
    })
    setTableHeader([...tableColumns])
  }

  const _setTableData = (isAddNewRow = false) => {
    const tableData = tableObject.table_data
    const finalTableData = []
    tableData &&
      tableData[0]?.values?.map((item, index) => {
        const tableRowObject = {
          id: item.id,
        }

        tableData?.map((tableC, tableI) => {
          const tempObject = new Object()

          if (isEdit) {
            tempObject[tableC['column_name']] = (
              <>
                <input
                  type="text"
                  value={tableC.values[index].value}
                  onChange={e => handleChange(tableC['column_name'], e.target.value)}
                ></input>
              </>
            )
          } else {
            tempObject[tableC['column_name']] = tableC.values[index].value
          }
          Object.assign(tableRowObject, tempObject)
        })
        finalTableData.push(tableRowObject)
      })
    console.log(finalTableData)

    if (isAddNewRow && emptyNewRow != {}) {
      finalTableData.push(emptyNewRow)
    }
    setTableRows([...finalTableData])
  }

  const _updateTableData = (image, payload, actionType = 'add_row') => {
    const formData = new FormData()
    if (image) {
      formData.append('file', image)
    }

    formData.append('data', payload)

    API.post('tokuchu/page/update_table_data', formData)
      .then(data => {
        toast.success('New row added Successfully')
      })
      .catch(err => {})
  }

  const addRow = () => {
    const tempObject = {
      isEdit: true,
      edit: (
        <div className="edit-icons">
          <div className="icon reject">
            <i className="fa-solid fa-xmark reject" onClick={() => {}} />
          </div>
          <div className="icon accept">
            <i
              className="fa-solid fa-check"
              onClick={() => {
                convertData()
              }}
            />
          </div>
        </div>
      ),
    }
    const rowHandler = {}
    tableHeader.map((item, index) => {
      rowHandler[item['name']] = ''
      tempObject[item['name']] = (
        <>
          <input
            type="text form-control"
            id={rowName[item['name']] + Math.random().toString()}
            key={rowName[item['name']] + Math.random().toString()}
            value={rowName[item['name']]}
            onChange={e => handleChange(item['name'], e.target.value)}
          ></input>
        </>
      )
    })

    setRowName(rowHandler)
    setEmptyNewRow(tempObject)
    setNeedToReload(!needToReload)
    document.body.style.overflow = 'scroll'
  }

  const convertData = () => {
    let dataArray = []

    const keys = Object.keys(rowName)
    keys.forEach(key => {
      dataArray.push({
        [key]: rowName[key],
      })
    })

    const payload = {
      table_id: tableRows[0].id,
      data: dataArray,
      action_type: 'add_row',
    }

    _updateTableData(`http://www.africau.edu/images/default/sample.pdf`, JSON.stringify(payload))
  }

  useEffect(() => {
    _setTableData(true)
  }, [needToReload])

  useEffect(() => {
    if (tableObject != {}) {
      _setTableHeaders()
      _setTableData()
    }
  }, [tableObject, isEdit])

  return (
    <>
      {tableObject != {} && (
        <div
          className="position-absolute text-primary"
          style={{ zIndex: '4', right: '0', marginTop: '-36px' }}
        >
          <i
            className="fa-solid fa-pen-to-square"
            onClick={() => {
              setEdit(true)
              _setTableData()
            }}
          ></i>
          <i
            className="fa-solid fa-trash"
            onClick={() => {
              setShowDeleteModal(true)
            }}
          ></i>
        </div>
      )}

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

      {(getUserRoles() == 'PMK Administrator' || getUserRoles() == 'Technical Administrator') && (
        <div
          className="add_row"
          style={{ fontSize: '1rem', background: 'none' }}
          onClick={() => {
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
            addRow()
          }}
        >
          <img
            src={Plusicon}
            style={{
              width: '1rem',
              marginRight: '0.2rem',
            }}
            className={'mr-2'}
          />
          {'Add'}
        </div>
      )}
    </>
  )
}
