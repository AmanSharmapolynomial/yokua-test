import React, { useEffect, useState, useRef } from 'react'
import DataTable from 'react-data-table-component'
import Plusicon from '../../assets/Group 331.png'
import accept from '../../assets/Icon ionic-md-checkmark-circle.png'
import decline from '../../assets/Icon ionic-md-close-circle.png'
import { Image } from 'react-bootstrap'
import API from '../../utils/api'
import { toast } from 'react-toastify'

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
  const [tableRows, setTableRows] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [isEditable, setIsEditable] = useState(false)
  const inputRef = useRef([])
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

        tableData?.map(column_name => {
          const tempObject = new Object()
          tempObject[column_name['column_name']] = column_name.values[index].value
          Object.assign(tableRowObject, tempObject)
        })
        finalTableData.push(tableRowObject)
      })
    setTableRows([...finalTableData])
  }

  const callAddRowAPI = async () => {
    let data = []
    tableObject.forEach(col => {
      data.push({ column_name: col.column_name /*, values*/ })
    })

    inputRef.current.forEach((input, idx) => {
      data[idx] = { ...data[idx], values: [/*...data[idx].values,*/ input.value] }
    })

    const payload = {
      table_id: tableObject[0].table_id,
      action_type: 'add_row',
      data: data,
    }
    const response = await API.post('/products/page/update_table_data', payload)
    toast.success(response.data.message)
    onRefresh()
    setIsEditable(false)
  }

  const renderDummyRow = () => {
    return (
      <div className="add-row overflow-auto">
        {tableObject.map((ele, idx) => (
          <div className="dummy-col" style={{ minWidth: '100px' }}>
            <input ref={el => (inputRef.current[idx] = el)} />
            {tableObject.length === idx + 1 && (
              <>
                <Image
                  role={'button'}
                  src={decline}
                  className="ml-2"
                  onClick={() => {
                    setIsEditable(false)
                  }}
                />
                <Image
                  role={'button'}
                  src={accept}
                  className="mx-2"
                  onClick={() => {
                    callAddRowAPI()
                  }}
                />
              </>
            )}
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => {
    if (tableObject !== {}) {
      _setTableHeaders()
      _setTableData()
    }
  }, [tableObject])

  return (
    <>
      {tableObject != {} && (
        <div className="ml-auto mt-4">
          <i className="fa-solid fa-pen-to-square mr-2" />
          <i
            className="fa-solid fa-trash ml-2"
            onClick={() => {
              setShowDeleteModal(true)
            }}
          />
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
          persistTableHead
        />
        {isEditable ? (
          renderDummyRow()
        ) : (
          <div
            role={'button'}
            className="add-row"
            onClick={() => {
              setIsEditable(true)
            }}
          >
            <img
              src={Plusicon}
              style={{
                width: '16px',
                marginRight: '12px',
              }}
              alt={'PlusIcon'}
            />
            Add
          </div>
        )}
      </div>
    </>
  )
}
