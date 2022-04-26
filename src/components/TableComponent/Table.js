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
export default ({ tableObject, setShowDeleteModal, onRefresh, isAdmin, isTableEditable }) => {
  const [tableRows, setTableRows] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [isEditable, setIsEditable] = useState(false)
  const [sortMethod, setSortMethod] = useState('')
  const inputRef = useRef([])
  const customStyles = {
    table: {
      style: {
        border: 'none',
      },
    },
    rows: {
      style: {
        border: '1px solid black',
      },
    },
    headRow: {
      style: {
        borderBottom: '1px solid var(--bgColor2)',
        fontSize: '0.8rem',
      },
    },
    row: {
      style: {
        border: '2px solid black',
        borderLeft: 'none',
        borderRight: 'none',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        backgroundColor: 'var(--bgColor2)',
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'capitalize',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
        fontSize: '0.8rem',
      },
    },
    noData: {
      style: {
        border: '1px solid black',
      },
    },
  }

  const _setTableHeaders = sort => {
    const tableColumns = []
    tableObject?.map((column, index) => {
      const tempColumnName = column.column_name
      if (!column.is_filterable) {
        tableColumns.push({
          name: column.column_name,
          selector: row => row[tempColumnName],
          wrap: true,
          sortable: column.is_sortable,
          isLink: column.is_link,
          isDate: column.is_date,
          filterable: column.is_filterable,
        })
      } else {
        const filters = column.values.map(item => item.value)
        tableColumns.push({
          name: (
            <div className="dropdown">
              <div
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                className="dropdown-toggle"
                src={require('../../assets/Rearrange order.png')}
              >
                {column.column_name}
              </div>

              <div className="dropdown-menu">
                {filters.map((element, index) => (
                  <span
                    style={{
                      color: 'rgba(0,0,0,0.87)',
                      fontWeight: element === sort ? '600' : '400',
                    }}
                    key={index}
                    className="dropdown-item filter-item"
                    onClick={() => {
                      if (element !== sort) {
                        setSortMethod(element)
                        handleSort(column.column_name, element)
                        _setTableHeaders(element)
                      } else {
                        setSortMethod('')
                        handleSort(column.column_name, undefined)
                        _setTableHeaders(undefined)
                      }
                    }}
                  >
                    {element}
                  </span>
                ))}
              </div>
            </div>
          ),
          selector: row => row[tempColumnName],
          wrap: true,
          sortable: column.is_sortable,
          isLink: column.is_link,
          isDate: column.is_date,
          filterable: column.is_filterable,
        })
      }
    })
    setTableHeader([...tableColumns])
  }
  const handleSort = (column, type) => {
    const tableData = tableObject
    const finalTableData = []
    tableData &&
      tableData[0]?.values?.map((item, index) => {
        const tableRowObject = {
          id: item.id,
        }

        tableData?.map(column_name => {
          const tempObject = new Object()
          let value = column_name.values[index].value
          if (column_name.is_link) {
            value = (
              <a href={value} target="_blank">
                {value}
              </a>
            )
          }
          tempObject[column_name['column_name']] = value
          Object.assign(tableRowObject, tempObject)
        })
        finalTableData.push(tableRowObject)
      })
    if (type) {
      const filteredItems = finalTableData.filter(item => item[column] === type)
      setTableRows([...filteredItems])
    } else {
      setTableRows([...finalTableData])
    }
  }

  const handleChange = (name, value, index) => {
    console.log(name, value, index, tableRows)
    // const updatedRowName = rowName
    // updatedRowName[name] = value
    // setRowName({ ...updatedRowName })
  }

  const _setTableData = () => {
    const tableData = tableObject
    const finalTableData = []
    tableData &&
      tableData[0]?.values?.map((item, index) => {
        const tableRowObject = {
          id: item.id,
        }

        tableData?.map((column_name, column_index) => {
          if (!isTableEditable) {
            const tempObject = new Object()
            let value = column_name.values[index].value
            if (column_name.is_link) {
              value = (
                <a href={value} target="_blank">
                  {value}
                </a>
              )
            }
            tempObject[column_name['column_name']] = value
            Object.assign(tableRowObject, tempObject)
          } else {
            const tempObject = new Object()
            let value = column_name.values[index].value
            tempObject[column_name['column_name']] = (
              <>
                <input
                  style={{
                    borderBottom: '1px solid rgb(0, 79, 155)',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderLeft: 'none',
                  }}
                  type={item.isDate ? 'date' : 'text form-control'}
                  value={value}
                  onChange={e => handleChange(item['column_name'], e.target.value, index)}
                />
              </>
            )
            Object.assign(tableRowObject, tempObject)
          }
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
                    if (inputRef.current[idx].value === '') {
                      toast.error('Cannot add with empty data')
                      return
                    }
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
  }, [tableObject, isTableEditable])

  return (
    <div className="border w-100 mt-4 p-0 product-detail-table">
      <DataTable
        pagination={false}
        paginationPerPage={false}
        fixedHeader
        columns={tableHeader}
        data={tableRows}
        customStyles={customStyles}
        persistTableHead
        // conditionalRowStyles={conditionalRowStyles}
        // selectableRows
        // onSelectedRowsChange={selectedRowsActionUA}
      />
      {isEditable ? (
        renderDummyRow()
      ) : isAdmin ? (
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
          />
          Add
        </div>
      ) : null}
    </div>
  )
}
