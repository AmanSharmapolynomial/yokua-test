import React, { useState, useEffect } from 'react'
import API from '../../../../utils/api'
import { toast } from 'react-toastify'

const BINARY = 'binary'
const TABLE = 'table'
const IMAGE = 'image'
const DESCRIPTION = 'description'
const LINK = 'link'

import { useLocation, useParams } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import Breadcrumb from '../../../../components/Breadcrumb'
import DeleteModal from '../../../../components/Modals/DeleteModal/index'

const ProductDetail = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const [isArchived] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [productDetail, setProductDetail] = useState([])
  const [sectionList, setSectionList] = useState([])
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const [isSectionOpen, setSectionOpen] = useState(false)
  const [isLinkOpen, setLinkOpen] = useState(false)
  const [isImageOpen, setImageOpen] = useState(false)
  const [isTableOpen, setTableOpen] = useState(false)
  const [isDescriptionOpen, setDescriptionOpen] = useState(false)
  const [isFileOpen, setFileOpen] = useState(false)

  const [sectionName, setSectionName] = useState('')
  const [linkObject, setLinkObject] = useState({ title: '', link: '', sectionId: 1 })
  const [descriptionObject, setDescriptionObject] = useState({ description: '', sectionId: 1 })
  const [binaryFileObject, setBinaryFileObject] = useState({ title: '', sectionId: 1 })
  const [imageData, setImageData] = useState({ title: '', sectionId: 1 })

  const [imageFile, setImageFile] = useState(null)
  const [binaryFile, setBinaryFile] = useState(null)

  useEffect(() => {
    getProductDetail()
    getSectionList()
  }, [])

  const getProductDetail = () => {
    setIsLoading(true)
    API.post('products/details/', {
      is_archived: isArchived,
      parent_id: id,
    })
      .then(res => {
        setProductDetail(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getSectionList = () => {
    API.get('products/page/list_sections')
      .then(res => {
        setSectionList(res.data['RAMC Product Details'])
      })
      .catch(error => {
        console.log(error)
      })
  }

  const deleteCancel = () => setOpenDeleteModal(false)
  const deleteConfirm = () => deleteComponent()
  const deleteComponent = (sectionId, componentId, componentType) => {
    if (openDeleteModal) {
      API.post('products/page/delete_component', {
        section_id: sectionId,
        component_id: componentId,
        component_type: componentType,
      })
        .then(res => {
          toast('Delete Successfully', { type: 'success' })
        })
        .catch(error => {
          toast('Error while deleting', { type: 'error' })
        })
      getProductDetail()
    } else {
      setOpenDeleteModal(true)
    }
  }

  const createSection = (pageId, sectionName, orderIndex = 1) => {
    API.post('products/create_section', {
      page_id: pageId,
      section_name: sectionName,
      order_index: orderIndex,
    })
      .then(res => {
        toast('Section created successfully', { type: 'success' })
      })
      .catch(error => {
        toast('Something went wrong', { type: 'error' })
      })
    getProductDetail()
  }

  const linkComponentToSection = (sectionId, componentId, componentType) => {
    API.post('products/page/link_component_to_sections', {
      section_id: sectionId,
      component_id: componentId,
      component_type: componentType,
    })
      .then(res => {
        toast('Component Linked Successfully', { type: 'success' })
      })
      .catch(error => {
        toast('Something went wrong', { type: 'error' })
      })
  }

  const archieveComponent = (id, componentType, archiveType) => {
    API.post('products/page/set_archive', {
      id: id,
      archive_type: archiveType,
      component_type: componentType,
    })
      .then(res => {
        toast('Component Achieved Successfully', { type: 'success' })
      })
      .catch(error => {
        toast('Something went wrong', { type: 'error' })
      })
    getProductDetail()
  }

  const updateTableCell = (tableId, columnName, rowIndex, value) => {
    API.post('products/page/update_table_data', {
      table_id: tableId,
      action_type: 'update_cell',
      column_name: columnName,
      row_index: rowIndex,
      value: value,
    })
      .then(res => {
        toast('Updated Successfully', { type: 'success' })
      })
      .catch(error => {
        toast('Can not update', { type: 'error' })
      })
  }

  const updateTableAddRow = tableId => {
    // TODO: Create Data Object
    const data = [
      {
        column_name: 'columnName',
        values: ['1', '2'],
      },
      {
        column_name: 'columnName',
        values: ['1', '2'],
      },
    ]
    API.post('products/page/update_table_data', {
      table_id: tableId,
      action_type: 'add_row',
      data: data,
    })
      .then(res => {
        toast('Updated Successfully', { type: 'success' })
      })
      .catch(error => {
        toast('Can not update', { type: 'error' })
      })
  }

  const addComponent = (type, sectionId = 1) => {
    const url = 'products/page/add_component'
    const formData = new FormData()
    const body = {
      type: type,
      section_id: sectionId,
    }
    if (type === LINK) {
      Object.assign(body, { data: linkObject })
      formData.append('data', JSON.stringify(body))

      API.post(url, formData, { headers: { 'content-type': 'multipart/form-data' } })
        .then(data => {
          toast('Component Added Succesfully', { type: 'success' })
        })
        .catch(error => toast('Something went wrong', { type: 'error' }))
    } else if (type === BINARY) {
      Object.assign(body, { data: binaryFileObject })
      formData.append('data', JSON.stringify(body))
      formData.append('file', binaryFile)

      API.post(url, formData)
        .then(data => {
          toast('Component Added Succesfully', { type: 'success' })
        })
        .catch(error => toast('Something went wrong', { type: 'error' }))
    } else if (type === IMAGE) {
      Object.assign(body, { data: binaryFileObject })
      formData.append('data', JSON.stringify(body))
      formData.append('file', imageFile)

      API.post(url, formData)
        .then(data => {
          toast('Component Added Succesfully', { type: 'success' })
        })
        .catch(error => toast('Something went wrong', { type: 'error' }))
    } else if (type === DESCRIPTION) {
      Object.assign(body, { data: descriptionObject })
      formData.append('data', JSON.stringify(body))

      API.post(url, formData, { headers: { 'content-type': 'multipart/form-data' } })
        .then(data => {
          toast('Component Added Succesfully', { type: 'success' })
        })
        .catch(error => toast('Something went wrong', { type: 'error' }))
    } else if (type === TABLE) {
      Object.assign(body, { data: linkObject })

      API.post(url, formData)
        .then(data => {
          toast('Component Added Succesfully', { type: 'success' })
        })
        .catch(error => toast('Something went wrong', { type: 'error' }))
    } else {
      toast('Not a Component', { type: 'error' })
    }
  }

  return (
    <>
      <div className="container font-poppins">
        {openDeleteModal && (
          <DeleteModal
            show={openDeleteModal}
            deleteCancel={deleteCancel}
            deleteConfirm={deleteConfirm}
            deleteMessage={'Are you sure you want to delete this component ?'}
            deleteTitle={'Attention!'}
          />
        )}
        <Breadcrumb previousPages={state.previousPage} currentPage={state.header} />
        <h3 className={'mt-4 mb-2 font-poppins'}>{state.header}</h3>

        {
          /**
           * @description Looping through the All the Sections in Product Details
           */
          productDetail.map((item, index) => (
            <>
              <div key={item.section_id}>
                <>
                  <div className={'row mt-3 mb-3 '}>
                    <div className={'col-6 d-flex align-items-center '}>
                      <i className="fa-solid fa-circle align-self-center me-1"></i>
                      <h5 className={'head-5'}>
                        {item.sectionName}
                        <span></span>
                      </h5>
                    </div>
                  </div>
                </>

                {item.components.length < 1 && <p className={'ms-5'}>No Components Found</p>}

                {item.components.length > 0 &&
                  item.components.map((component, i) => {
                    /**
                     * @description Looping through the component in the Section
                     */
                    /**
                     * @description if Component type is BINARY It will return this component
                     */
                    if (component.type === DESCRIPTION) {
                      return <p>{component.description}</p>
                    }

                    if (component.type === BINARY) {
                      return <ImageComponent item={component} />
                    }
                    if (component.type === LINK) {
                      return (
                        <>
                          {' '}
                          <a href={component.link}>{component.title}</a>
                          <hr />
                        </>
                      )
                    }
                    /**
                     * @description if Component type is TABLE It will return this component
                     */
                    if (component.type === TABLE) {
                      return (
                        <>
                          <Headerbar
                            title={component.table_name}
                            deleteComponent={() =>
                              deleteComponent(
                                item.section_id,
                                component.component_id,
                                component.component_type
                              )
                            }
                          />
                          <TableComponent item={component} />
                        </>
                      )
                    }
                    /**
                     * @description if Component type is IMAGE It will return this component
                     */
                    if (component.type === IMAGE) {
                      return <ImageComponent item={component} />
                    }
                  })}
              </div>
            </>
          ))
        }
        <>
          {/*  CREATE SECTION  */}
          <hr className={'mt-3'} />
          <h6>{'Create Section'}</h6>
          <button
            className="add-table mt-2 ms-3 mb-3"
            onClick={() => setSectionOpen(!isSectionOpen)}
          >
            Create Section
          </button>
          {isSectionOpen && (
            <div className={'row font-size ms-3'}>
              <div className={'col-3'}>
                <div className="input-group input-group-sm  mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Section Title"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={sectionName}
                    onChange={e => setSectionName(e.target.value)}
                    on
                  />
                  <div className="input-group-append ">
                    <button
                      onClick={() => createSection(id, sectionName)}
                      className='btn btn-primary blue "'
                      type="button"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <hr />

          {/*  CREATE LINK  */}

          <h6>{'Create Link'}</h6>
          <button
            className="add-table color mt-2 ms-3 mb-3"
            onClick={() => setLinkOpen(!isLinkOpen)}
          >
            Create Link
          </button>
          {isLinkOpen && (
            <div className={'row font-size ms-3'}>
              <div className={'col-8'}>
                <div className="input-group input-group-sm  mb-3">
                  <div className="input-group-prepend">
                    <select
                      onChange={e => setLinkObject({ ...linkObject, sectionId: e.target.value })}
                      className="form-select form-control form-select-sm font-size-small"
                      aria-label="Section"
                    >
                      {sectionList.map(item => (
                        <option value={item.section_id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Link Title"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={linkObject.title}
                    onChange={e => setLinkObject({ ...linkObject, title: e.target.value })}
                    on
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Link"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={linkObject.link}
                    onChange={e => setLinkObject({ ...linkObject, link: e.target.value })}
                    on
                  />
                  <div className="input-group-append ">
                    <button
                      onClick={() => addComponent(LINK, linkObject.sectionId)}
                      className='btn btn-primary blue "'
                      type="button"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <hr />

          <h6>{'Create Image'}</h6>
          <button
            className="add-table color mt-2 ms-3 mb-3"
            onClick={() => setImageOpen(!isImageOpen)}
          >
            Create Image
          </button>
          {isImageOpen && (
            <div className={'row font-size ms-3'}>
              <div className={'col-8'}>
                <div className="input-group input-group-sm  mb-3">
                  <div className="input-group-prepend">
                    <select
                      onChange={e => setImageData({ ...imageData, sectionId: e.target.value })}
                      className="form-select form-control form-select-sm font-size-small"
                      aria-label="Section"
                    >
                      {sectionList.map(item => (
                        <option value={item.section_id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Image Title"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={imageData.title}
                    onChange={e => setImageData({ ...imageData, title: e.target.value })}
                    on
                  />
                  <div className="input-group-append ">
                    <div className="input-group mb-3 ">
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="inputGroupFile01"
                          onChange={e => setImageFile(e.target.files[0])}
                        />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">
                          {imageFile ? imageFile.name : 'Choose file'}
                        </label>
                      </div>
                      <button
                        onClick={() => addComponent(IMAGE, imageData.sectionId)}
                        className='btn btn-primary blue font-size "'
                        type="button"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <hr />

          <h6>{'Create File'}</h6>
          <button
            className="add-table color mt-2 ms-3 mb-3"
            onClick={() => setFileOpen(!isFileOpen)}
          >
            Create File
          </button>
          {isFileOpen && (
            <div className={'row font-size ms-3'}>
              <div className={'col-8'}>
                <div className="input-group input-group-sm  mb-3">
                  <div className="input-group-prepend">
                    <select
                      onChange={e =>
                        setBinaryFileObject({ ...binaryFileObject, sectionId: e.target.value })
                      }
                      className="form-select form-control form-select-sm font-size-small"
                      aria-label="Section"
                    >
                      {sectionList.map(item => (
                        <option value={item.section_id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter File Title"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={binaryFileObject.title}
                    onChange={e =>
                      setBinaryFileObject({ ...binaryFileObject, title: e.target.value })
                    }
                  />
                  <div className="input-group-append ">
                    <div className="input-group mb-3 ">
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="inputGroupFile01"
                          onChange={e => setBinaryFile(e.target.files[0])}
                        />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">
                          {binaryFile ? binaryFile.name : 'Choose file'}
                        </label>
                      </div>
                      <button
                        onClick={() => addComponent(BINARY, binaryFileObject.sectionId)}
                        className='btn btn-primary blue font-size "'
                        type="button"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <hr />

          <h6>{'Create Description'}</h6>
          <button
            className="add-table color mt-2 ms-3"
            onClick={() => setDescriptionOpen(!isDescriptionOpen)}
          >
            Create Description
          </button>
          {isDescriptionOpen && (
            <div className={'row font-size ms-3'}>
              <div className={'col-8'}>
                <div className="input-group input-group-sm  mb-3">
                  <div className="input-group-prepend">
                    <select
                      onChange={e =>
                        setDescriptionObject({ ...descriptionObject, sectionId: e.target.value })
                      }
                      className="form-select form-control form-select-sm font-size-small"
                      aria-label="Section"
                    >
                      {sectionList.map(item => (
                        <option value={item.section_id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Description"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={descriptionObject.description}
                    onChange={e =>
                      setDescriptionObject({ ...descriptionObject, description: e.target.value })
                    }
                    on
                  />
                  <div className="input-group-append ">
                    <button
                      onClick={() => addComponent(DESCRIPTION, descriptionObject.sectionId)}
                      className='btn btn-primary blue "'
                      type="button"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <hr />

          <h6>{'Create Table'}</h6>
          <button className="add-table color mt-2 ms-3" onClick={() => setTableOpen(!isTableOpen)}>
            Create Table
          </button>
          <hr />
          {/*  TODO TABLE COMPONENT */}

          <></>
        </>
      </div>
    </>
  )
}

const ImageComponent = ({ item }) => {
  return (
    <>
      <div className="img-box">
        <i className="fa-solid fa-edit edit icon-blue" />
        <img className="img" src={item.image_link} />
      </div>
    </>
  )
}

const TableComponent = ({ item, deleteComponent }) => {
  let columnsApprovalTable = []
  let contentRowApprovalTable = []
  let columnNameList = []

  /**
   * @description Setting up the column for the particular table Component
   */
  item.table_data.map((column, index) => {
    const columnName = column['column_name']
    const columnHeader = {
      name: column.column_name,
      selector: row => row[columnName],
      sortable: column.is_sortable,
      isLink: column.is_link,
      isDate: column.is_date,
      filterable: column.is_filterable,
      cell: (row, a) => (
        <a
          href={row.posterUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => console.log(columnName)}
        >
          Download
        </a>
      ),
    }
    columnNameList.push(column.column_name)
    columnsApprovalTable.push(columnHeader)
  })

  /**
   * @description Setting up the rows for the particular table Component againt the column
   */
  if (item.table_data && item.table_data[0]) {
    const tableData = []
    const finalData = item.table_data[0].values
    finalData.map((value, valueIndex) => {
      const tempTableRow = {
        id: value.id,
      }

      // Adding Row wise data to Table from the Columns
      item.table_data.map((column, columnIndex) => {
        const t = new Object()
        t[column['column_name']] = column.values[valueIndex].value
        Object.assign(tempTableRow, t)
      })
      tableData.push(tempTableRow)
    })
    contentRowApprovalTable = [...tableData]
  }

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
  const conditionalRowStyles = [
    {
      when: row => row.id % 2 == 0,
      style: {},
    },
  ]

  return (
    <>
      <div className="mb-5 mt-3">
        <DataTable
          sortIcon={<i class="fa-solid fa-sort ms-1"></i>}
          pagination
          fixedHeader
          columns={columnsApprovalTable}
          data={contentRowApprovalTable}
          customStyles={customStyles}
          conditionalRowStyles={conditionalRowStyles}
          // selectableRows
          // onSelectedRowsChange={selectedRowsActionUA}
        />
        <AddTable />
      </div>
    </>
  )
}

const Headerbar = ({ title, deleteComponent }) => {
  return (
    <div className="tech-info ">
      <p>{title}</p>
      <div>
        <i className="fa-solid fa-edit icon-blue"></i>
        <i onClick={deleteComponent} className="fa-solid fa-trash" aria-hidden="true"></i>
      </div>
    </div>
  )
}

const AddTable = () => {
  return <button className="add-table color mt-3">Add Table</button>
}

export default ProductDetail
