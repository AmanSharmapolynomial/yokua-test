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
  const [needToReload, setNeedToReload] = useState(false)

  const [editModeData, setEditModeData] = useState([])
  const [filedChanged, setFieldChanged] = useState(false)

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

  const handleEditChange = (name, value, rowIndex) => {
    const updatedTableData = editModeData
    updatedTableData.forEach((c, i) => {
      if (rowIndex == i) {
        c[name] = value
      }
    })
    setEditModeData([...updatedTableData])
    setFieldChanged(!filedChanged)

    const updatedRows = updatedTableData
    updatedRows.forEach((c, i) => {
      Object.entries(c).forEach(([key, v]) => {
        debugger
        if (typeof v == 'string') {
          c[key] = (
            <>
              <input
                key={Math.random().toString()}
                id={v}
                type="text"
                value={v}
                onChange={e => handleEditChange(key, e.target.value, i)}
              ></input>
            </>
          )
        }
      })
    })
    setTableRows(p => {
      debugger
      console.log(p)
      return updatedRows
    })
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
    tableColumns.push({
      name: '',
      selector: row => row.edit,
    })
    setTableHeader([...tableColumns])
  }

  const _setTableData = (isAddNewRow = false) => {
    const tableData = tableObject.table_data
    const finalTableData = []
    let toAddInEdit = true
    tableData &&
      tableData[0]?.values?.map((item, index) => {
        const tableRowObject = {
          id: item.id,
        }

        tableData?.map((tableC, tableI) => {
          const tempObject = new Object()

          if (isEdit) {
            toAddInEdit = false
            tempObject[tableC['column_name']] = (
              <input
                type="text"
                value={tableC.values[index].value}
                onChange={e => handleEditChange(tableC['column_name'], e.target.value, tableI)}
              ></input>
            )
          } else {
            toAddInEdit = true
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

  const [temp, setTemp] = useState([
    {
      id: 1,
      title: (
        <input
          type="text"
          value={'1'}
          onChange={e => tempHandleChange('title', e.target.value, 1)}
        ></input>
      ),
      year: '1988',
    },
    {
      id: 2,
      title: 'Ghostbusters',
      year: '1984',
    },
  ])
  const tempHandleChange = (name, value, i) => {}

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
              setEditModeData([...tableRows])
              setEdit(true)
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
        fixedHeader
        columns={tableHeader}
        data={tableRows}
        customStyles={customStyles}

        // conditionalRowStyles={conditionalRowStyles}
        // selectableRows
        // onSelectedRowsChange={selectedRowsActionUA}
      />

      <DataTable
        fixedHeader
        columns={[
          {
            name: 'Title',
            selector: row => row.title,
          },
          {
            name: 'Year',
            selector: row => row.year,
          },
        ]}
        data={temp}
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
            // document.body.scrollTop = 0
            // document.documentElement.scrollTop = 0
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
