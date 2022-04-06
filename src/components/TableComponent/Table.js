import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import { getUserRoles } from '../../utils/token'
import Plusicon from '../../assets/Group 331.png'
import API from '../../../src/utils/api'
import Uploadicon from '../../assets/Icon awesome-file-upload.png'

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
  const [imageFile, setImageFile] = useState(null)
  const [tableRows, setTableRows] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [numberOfColumns, setNumberOfColumns] = useState(0)
  const [numberOfRows, setNumberOfRows] = useState(0)
  const [needToReload, setNeedToReload] = useState(false)

  const [editModeData, setEditModeData] = useState([])

  const [emptyNewRow, setEmptyNewRow] = useState(null)
  const [rowName, setRowName] = useState({})
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
  const imageFileInputRef = useRef()

  const handleChange = (name, value) => {
    const updatedRowName = rowName
    updatedRowName[name] = value
    setRowName({ ...updatedRowName })
  }

  // Not usable in current context in updated Flow
  // const handleEditChange = (name, value, rowIndex) => {
  //   const updatedTableData = editModeData
  //   updatedTableData.forEach((c, i) => {
  //     if (rowIndex == i) {
  //       c[name] = value
  //     }
  //   })
  //   setEditModeData([...updatedTableData])
  //   setFieldChanged(!filedChanged)
  //
  //   const updatedRows = updatedTableData
  //   updatedRows.forEach((c, i) => {
  //       Object.entries(c).forEach(
  //         ([key, v]) => {
  //           debugger
  //           if (typeof v == 'string') {
  //             c[key] = (
  //               <>
  //                 <input
  //                   key={Math.random().toString()}
  //                   id={v}
  //                   type='text'
  //                   value={v}
  //                   onChange={e => {
  //                   }}
  //                 ></input>
  //               </>
  //             )
  //           }
  //         })
  //     },
  //   )
  //   setTableRows((p) => {
  //     debugger
  //     console.log(p)
  //     return updatedRows
  //   })
  //
  // }

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
    tableData &&
      tableData[0]?.values?.map((item, index) => {
        const tableRowObject = {
          id: item.id,
        }

        tableData?.map((tableC, tableI) => {
          const tempObject = {}
          if (tableC['column_name'] === 'Tokuchu') {
            tempObject[tableC['column_name']] = (
              <>
                <img src={Uploadicon} style={{width:'15px', marginRight:'10px'}} />
                <a target="_blank" href={tableC.values[index].value}>
                </a>
              </>
            )
          } else {
            tempObject[tableC['column_name']] = tableC.values[index].value
          }

          Object.assign(tableRowObject, tempObject)
        })
        finalTableData.push(tableRowObject)
      })
    debugger
    if (isEdit && emptyNewRow) {
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
      .catch(err => { })
  }

  const handleImage = e => {
    setImageFile(e.event.files[0])
  }

  const addRow = () => {
    const tempObject = {
      isEdit: true,
      edit: (
        <div className="edit-icons">
          <div className="icon reject">
            <i className="fa-solid fa-xmark reject" onClick={() => _setTableData(false)} />
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
      if (item['name'] === 'Tokuchu') {
        tempObject[item['name']] = (
          <input


            ref={imageFileInputRef}
            id={Math.random().toString()}
            key={Math.random().toString()}
            type="file"
            onChange={handleImage}
          />
        )
      } else {
        tempObject[item['name']] = (
          <>
            <input


              style={{ borderBottom: '1px solid rgb(0, 79, 155)', borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}
              type="text form-control"
              id={rowName[item['name']] + Math.random().toString()}
              key={rowName[item['name']] + Math.random().toString()}
              value={rowName[item['name']]}
              onChange={e => handleChange(item['name'], e.target.value)}
            />
          </>
        )
      }
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
      table_id: tableObject.id,
      data: dataArray,
      action_type: 'add_row',
    }
    _updateTableData(imageFileInputRef.current.files[0], JSON.stringify(payload))
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
      {tableObject !== {} && (
        <div
          className="position-absolute text-primary"
          style={{ zIndex: '4', right: '0', marginTop: '-36px' }}
        >
          {isEdit ? (
            <i

              className="fa-solid fa-solid fa-bookmark"
              onClick={() => {
                setEditModeData([...tableRows])
                setEdit(false)
              }}
            />
          ) : (
            <i
            className="fa-solid fa-pen-to-square" aria-hidden="true"
              onClick={() => {
                setEditModeData([...tableRows])
                setEdit(true)
              }}
            />
          )}
          <i
            className="fa-solid fa-trash"
            onClick={() => {
              setShowDeleteModal(true)
            }}
          />
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

      {(getUserRoles() === 'PMK Administrator' || getUserRoles() === 'Technical Administrator') &&
        isEdit && (
          <div
            className="add_row"
            style={{ fontSize: '1rem', background: 'none' }}
            onClick={() => {
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
              alt={'icon'}
            />
            {'Add'}
          </div>
        )}
    </>
  )
}
