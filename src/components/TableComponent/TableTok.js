import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getUserRoles } from '../../utils/token'
import Plusicon from '../../assets/Group 331.png'

export default ({ tableObject, setShowDeleteModal, updateTableData }) => {
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
          toAddInEdit = true
          tempObject[tableC['column_name']] = tableC.values[index].value
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

  const _totalNumberOfRowsAndColumns = () => {
    setNumberOfColumns(tableObject?.table_data?.length)
    setNumberOfRows(tableObject?.table_data?.values?.length)
  }

  useEffect(() => {
    if (tableObject != {}) {
      _totalNumberOfRowsAndColumns()
      _setTableHeaders()
      _setTableData()
    }
  }, [tableObject, isEdit])

  const _handleEditChange = (columnName, columnValue, rowIndex) => {
    console.log(columnName, columnValue, rowIndex)
    const updatedRows = tableRows
    updatedRows.forEach((row, i) => {
      if (i === rowIndex) {
        row[columnName] = columnValue
      }
    })
    setTableRows([...updatedRows])
  }

  const addRow = () => {
    const updatedRows = tableRows
    const tempObject = {
      isEdit: true,
    }
    tableHeader.map((c, i) => {
      tempObject[c.name] = ''
    })
    updatedRows.push(tempObject)
    setTableRows([...updatedRows])
  }

  const cancelAddRow = () => {
    const updatedRows = tableRows
    updatedRows.pop()
    setTableRows([...updatedRows])
  }

  const convertData = () => {
    const item = tableRows[tableRows.length - 1]
    const dataArray = []
    console.log(item)
    debugger
    for (const [key, value] of Object.entries(item)) {
      if (key != 'Tokuchu' && key != 'id' && key != 'isEdit' && key != '') {
        const tempObject = {
          column_name: key,
          values: value,
        }
        dataArray.push(tempObject)
      }
    }

    debugger
    console.log('Seomhkirngiuerbn', item['Tokachu'])
    updateTableData(item['Tokuchu'], dataArray, tableObject.id)
  }

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
      <div className="yk-table-t container">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              {tableHeader.map((item, index) => {
                return (
                  <th scope="col">
                    {item.name}
                    <i className="bi bi-caret-down-fill mt-2"></i>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, rowIndex) => {
              return (
                <tr>
                  {/*Looping thrpugh the different Columns*/}
                  {tableHeader.map((column, a) => {
                    if (isEdit || row.isEdit) {
                      if (column.name == 'Tokuchu') {
                        return (
                          <td>
                            <input
                              type="file"
                              onChange={e =>
                                _handleEditChange(column.name, e.target.files[0], rowIndex)
                              }
                            ></input>
                          </td>
                        )
                      } else if (column.name === '') {
                        return (
                          <td>
                            <div className="edit-icons">
                              <div className="icon reject">
                                <i
                                  className="fa-solid fa-xmark reject"
                                  onClick={() => {
                                    cancelAddRow()
                                  }}
                                />
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
                          </td>
                        )
                      } else {
                        return (
                          <td>
                            <input
                              type="text"
                              value={row[column.name]}
                              onChange={e =>
                                _handleEditChange(column.name, e.target.value, rowIndex)
                              }
                            ></input>
                          </td>
                        )
                      }
                    } else {
                      if (column.name == 'Tokuchu') {
                        return (
                          <td>
                            <i className="fa-solid fa-file" />
                            <a target="_blank" href={row[column.name]}>
                              Open file
                            </a>
                          </td>
                        )
                      } else {
                        return <td>{row[column.name]}</td>
                      }
                    }
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
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
