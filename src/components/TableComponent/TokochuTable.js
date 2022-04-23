import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import { getUserRoles } from '../../utils/token'
import Plusicon from '../../assets/Group 331.png'
import API from '../../../src/utils/api'
import { toast } from 'react-toastify'
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

export default ({ tableObject, setShowDeleteModal, onRefresh }) => {
  const [imageFile, setImageFile] = useState(null)
  const [tableRows, setTableRows] = useState([])
  const [tableHeader, setTableHeader] = useState([])
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
                <img
                  src={Uploadicon}
                  style={{ width: '15px', marginRight: '10px' }}
                  alt={'FileImage'}
                />
                <a target="_blank" href={tableC.values[index].value} />
              </>
            )
          } else {
            tempObject[tableC['column_name']] = tableC.values[index].value
          }

          Object.assign(tableRowObject, tempObject)
        })
        finalTableData.push(tableRowObject)
      })
    if (isEdit && emptyNewRow) {
      finalTableData.push(emptyNewRow)
    }
    setTableRows([...finalTableData])
  }

  const _updateTableData = (image, payload, actionType = 'add_row') => {
    const formData = new FormData()
    if (!image) {
      toast.error('Please provide the Tokuchu')
    }
    if (image) {
      formData.append('file', image)
    }

    formData.append('data', payload)

    API.post('tokuchu/page/update_table_data', formData)
      .then(data => {
        toast.success('New row added Successfully')
        onRefresh()
      })
      .catch(err => {})
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
            <i
              className="fa-solid fa-xmark reject"
              onClick={() => _setTableData(false)}
              role="button"
            />
          </div>
          <div className="icon accept">
            <i
              role="button"
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
              style={{
                borderBottom: '1px solid rgb(0, 79, 155)',
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
              }}
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
    document.body.style.overflow = 'auto'
  }

  const convertData = () => {
    let dataArray = []
    let isBlankValue = false
    const keys = Object.keys(rowName)
    keys.forEach(key => {
      if (rowName[key] == '' || !rowName[key]) {
        isBlankValue = true
      }
      dataArray.push({
        column_name: key,
        values: rowName[key],
      })
    })

    if (isBlankValue) {
      toast.error('Please fill all the Fields')
      return
    }

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
      {tableObject &&
        tableObject !== {} &&
        (getUserRoles() == 'PMK Administrator' ||
          getUserRoles() == 'PMK Content Manager' ||
          getUserRoles() == 'Technical Administrator') && (
          <div className="row text-primary">
            <div className="ml-auto w-auto my-2 my-2">
              {isEdit ? (
                <i
                  role={'button'}
                  className="fa-solid fa-solid fa-bookmark ml-2"
                  onClick={() => {
                    setEditModeData([...tableRows])
                    setEdit(false)
                  }}
                />
              ) : (
                <i
                  role={'button'}
                  className="fa-solid fa-pen-to-square ml-2"
                  aria-hidden="true"
                  onClick={() => {
                    setEditModeData([...tableRows])
                    setEdit(true)
                  }}
                />
              )}
              <i
                role={'button'}
                className="fa-solid fa-trash ml-2"
                onClick={() => {
                  setShowDeleteModal(true)
                }}
              />
            </div>
          </div>
        )}
      <div className="row">
        <DataTable
          fixedHeader
          persistTableHead
          columns={tableHeader}
          data={tableRows}
          customStyles={customStyles}
        />
      </div>
      {(getUserRoles() === 'PMK Administrator' || getUserRoles() === 'Technical Administrator') &&
        isEdit && (
          <div
            className="add_row"
            style={{ fontSize: '1rem', background: 'none' }}
            onClick={() => {
              if (!emptyNewRow) {
                addRow()
              } else {
                toast.error('Please finish current edit.')
              }
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
