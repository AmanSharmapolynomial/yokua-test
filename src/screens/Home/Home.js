import React from 'react'
import { getToken, getUserRoles } from '../../utils/token'
import { useLoading } from '../../utils/LoadingContext'
import { useNavigate } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import PrimaryHeading from '../../components/Primary Headings'
import API from '../../utils/api'
import HomeCard from '../../components/ProductCard/HomeCard'
import editIcon from '../../assets/Icon awesome-edit.png'
import RYGBottom from '../../assets/home-bottom.png'
import GoTo from '../../assets/goto.png'
import saveIcon from '../../assets/ic_save.png'
import { Modal, Table } from 'react-bootstrap'
import RYGImage from '../../assets/RYG-Information banner.png'
import Tooltip from '@mui/material/Tooltip'
import { arrayMove, sortableContainer, sortableElement } from 'react-sortable-hoc'
import { arrayMoveImmutable } from 'array-move'
import { toast } from 'react-toastify'

const SortableItem = sortableElement(({ value }) => (
  <div
    style={{
      border: '2px solid #ccc',
      width: '100%',
    }}
    className="p-3 mx-2 my-2"
  >
    {value.name}
  </div>
))

const SortableContainer = sortableContainer(({ children }) => {
  return <div className="w-100">{children}</div>
})

const Home = () => {
  const isAdmin =
    getUserRoles() == 'Technical Administrator' ||
    getUserRoles() == 'PMK Administrator' ||
    getUserRoles() == 'PMK Content Manager'

  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [home, setHome] = React.useState(null)
  const [productList, setProductList] = React.useState([])
  const [showModal, setShowModal] = React.useState(false)
  const [isQuickLinkEditable, setIsQuickLinkEditable] = React.useState(false)
  const [isFavEditable, setIsFavEditable] = React.useState(false)
  const [isAddModalVisible, setIsAddModalVisible] = React.useState(-1) // 0 -> Quick Links, 1 -> Fav Links
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(-1)
  const [selectedItem, setSelectedItem] = React.useState(null)
  const inputTitle = React.useRef(null)
  const inputLink = React.useRef(null)

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newItems = arrayMoveImmutable(productList, oldIndex, newIndex).map((item, index) => {
      return { ...item, order_id: index + 1 }
    })
    console.log('new items', newItems)
    setProductList(newItems)
  }

  const getHomeDetails = () => {
    setLoading(true)
    API.get('home')
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          setHome(res.data)
        }
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const reorderProducts = () => {
    setLoading(true)
    API.post('products/change_order', { product_list: productList })
      .then(res => {
        console.log('res', res)
        toast.success('Products reordered successfully')
        getHomeDetails()
        setLoading(false)
        setShowModal(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const addQuickLinks = payload => {
    setLoading(true)
    API.post('home/quick_links', payload)
      .then(res => {
        getHomeDetails()
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
      .finally(() => {
        setIsAddModalVisible(-1)
      })
  }

  const addFavLinks = payload => {
    setLoading(true)
    API.post('home/my_favorites', payload)
      .then(res => {
        getHomeDetails()
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
      .finally(() => {
        setIsAddModalVisible(-1)
      })
  }
  const deleteQuickLinks = id => {
    setLoading(true)
    API.post('home/delete/quick_links', { id: [id] })
      .then(res => {
        getHomeDetails()
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const deleteFavLinks = id => {
    setLoading(true)
    API.post('home/delete/my_fav_links', { id: [id] })
      .then(res => {
        getHomeDetails()
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const HomeCardComponent = ({
    title,
    data,
    isImage = false,
    image,
    state,
    set,
    setAdd,
    setDelete,
    isAdmin,
  }) => {
    const capitalizeFirstLetter = string => {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    if (!isImage)
      return (
        <div className="col col-lg-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <div className="row card-header-title">
                <span className="col" style={{ fontSize: 'large' }}>
                  {title}
                </span>
                {isAdmin && (
                  <span className="col-auto d-none d-lg-block">
                    {!state ? (
                      <Tooltip title="Edit">
                        <i
                          className="fa-solid fa-pen-to-square theme"
                          style={{ cursor: 'pointer' }}
                          onClick={e => {
                            e.stopPropagation()
                            set(!state)
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Save">
                        <i
                          className="fa-solid fa-floppy-disk theme"
                          style={{ cursor: 'pointer' }}
                          onClick={e => {
                            e.stopPropagation()
                            set(!state)
                          }}
                        />
                      </Tooltip>
                    )}
                  </span>
                )}
              </div>
              {data &&
                data.map((item, idx) => (
                  <div className="row card-header-items">
                    <a
                      href={item.link}
                      target="_blank"
                      role={'button'}
                      className="col register-link"
                      style={{ textAlign: 'left' }}
                    >
                      {capitalizeFirstLetter(item.name)}
                    </a>
                    {state && (
                      <Tooltip title="Delete">
                        <i
                          role={'button'}
                          className="fa-solid fa-trash col-auto"
                          style={{
                            color: '#000',
                          }}
                          onClick={e => {
                            setDelete(item)
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
                ))}
              {isAdmin && (
                <div className="row mt-auto">
                  <div className="col">
                    <button
                      className="btn px-1 py-1 d-lg-flex d-none w-auto"
                      onClick={() => {
                        setAdd()
                      }}
                    >
                      Add Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    else
      return (
        <div className="col col-lg-4 d-none d-lg-block">
          <img
            className="rounded-2"
            style={{
              height: '18rem',
              objectFit: 'cover',
              width: '100%',
            }}
            src={RYGImage}
          />
        </div>
      )
  }

  React.useEffect(() => {
    getHomeDetails()
  }, [])

  return (
    <>
      <Header
        isLogedIn={getToken()}
        isAdmin={
          getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
        }
      />
      <div className="row mx-2 mx-lg-5 h-100">
        <div className="col center py-3">
          <PrimaryHeading title={'Home'} backgroundImage={'home-banner'} />
          <div className="row mt-4">
            <HomeCardComponent
              title={'Quick Links'}
              data={home?.quick_links}
              state={isQuickLinkEditable}
              set={bool => {
                setIsQuickLinkEditable(bool)
              }}
              setAdd={() => {
                setIsAddModalVisible(0)
              }}
              setDelete={item => {
                setIsDeleteModalVisible(0)
                setSelectedItem(item)
              }}
              isAdmin={isAdmin}
            />
            <HomeCardComponent
              title={'My Favourites'}
              data={home?.my_favorites}
              state={isFavEditable}
              set={bool => {
                setIsFavEditable(bool)
              }}
              setAdd={() => {
                setIsAddModalVisible(1)
              }}
              setDelete={item => {
                setIsDeleteModalVisible(1)
                setSelectedItem(item)
              }}
              isAdmin={true}
            />
            <HomeCardComponent isImage={true} />
          </div>
          <div className="row mt-4">
            <div className="d-flex justify-content-between w-100 align-items-center">
              <div className="ryg-header-title">Product Related Information</div>
              {isAdmin && (
                <div className="mx-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="currentColor"
                    class="bi bi-list-ol"
                    style={{ cursor: 'pointer' }}
                    viewBox="0 0 16 16"
                    onClick={() => {
                      setProductList(home?.product_related_info)
                      setShowModal(true)
                    }}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"
                    />
                    <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z" />
                  </svg>
                </div>
              )}
            </div>
            {home?.product_related_info.map((item, index) => (
              <HomeCard
                item={item}
                index={index}
                onClick={() => {
                  if (item?.tokuchu) navigate('/admin/approved-tokuchus')
                  else if (item?.name === 'Archive') navigate('/product-lines/archive')
                  else
                    navigate(
                      `/product-lines/sub-product/?itemId=${item.id}&archiveStatus=${
                        item.is_archived
                      }&itemName=${item.sub_product_name || item.name}`,
                      { state: item }
                    )
                }}
              />
            ))}
          </div>
          <div className="row mt-4 mb-4">
            <div className="col-12 col-lg-8">
              <div className="ryg-header-title">RYG Information</div>
              {/* <div className="align-self-center"> */}
              {/* <div className="ryg-text mt-xl-5"> */}
              <ul>
                <li>Register for Trainings</li>
                <li>Download the FlowConfigurator</li>
                <li>Get the latest Lead-time table</li>
                <li>
                  Download Service Information, Application Notes or Marketing Collaterals and much
                  more...
                </li>
              </ul>
              <div className="mt-2 text-center" role={'button'}>
                <Tooltip title="Go to RYG Information Page">
                  <Link to={'/ryg-information'}>
                    <img
                      src={GoTo}
                      style={{ width: '2rem', height: '2rem', objectFit: 'contain' }}
                      className="mt-2 mx-auto"
                    />
                  </Link>
                </Tooltip>
              </div>
              {/* </div> */}
            </div>
            <div className="col-8 col-lg-4 mx-auto mt-3 mt-lg-0">
              <img src={RYGBottom} className="home-ryg-img shadow" />
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={isAddModalVisible !== -1}
        centered
        onHide={() => {
          setIsAddModalVisible(-1)
        }}
      >
        {/* <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
          }}
        >
          <Modal.Title>{isAddModalVisible === 0 ? 'Quick Links' : 'My Favourites'}</Modal.Title>
        </Modal.Header> */}
        <Modal.Body
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            borderBottom: '0',
            fontWeight: '600',
          }}
        >
          <div className="col">
            <div className="h4" style={{}}>
              {isAddModalVisible === 0 ? 'Quick Links' : 'My Favourites'}
            </div>
            <div className="row">
              <form
                onSubmit={e => {
                  e.preventDefault()
                  if (
                    inputTitle.current.value.trim() !== '' &&
                    inputLink.current.value.trim() !== ''
                  ) {
                    if (isAddModalVisible === 0) {
                      addQuickLinks({
                        name: inputTitle.current.value.trim(),
                        link: inputLink.current.value.trim(),
                      })
                    } else if (isAddModalVisible === 1) {
                      addFavLinks({
                        name: inputTitle.current.value.trim(),
                        link: inputLink.current.value.trim(),
                      })
                    }
                  }
                }}
              >
                <div
                  className="form-group w-100 border-grey rounded"
                  // style={{ boxShadow: '0 0 20px -5px rgba(0,0,0,0.3)' }}
                >
                  <input
                    required
                    className="form-control focus-none w-100 border-0 py-2 text-bold font-8"
                    type="text"
                    placeholder="Title"
                    ref={inputTitle}
                  />
                  <hr className="m-0"></hr>
                  <input
                    required
                    className="form-control focus-none w-100 border-0 py-2 text-bold font-8"
                    type="url"
                    placeholder="Link"
                    ref={inputLink}
                  />
                  <hr className="m-0"></hr>
                  <div className="py-2">
                    <button
                      ref={ref => {
                        if (ref) {
                          ref.style.setProperty('background-color', 'white', 'important')
                          ref.style.setProperty('color', 'var(--bgColor2)', 'important')
                          ref.style.setProperty('font-size', '0.8rem', 'important')
                          ref.style.setProperty('text-align', 'center', 'important')
                        }
                      }}
                      style={{ minWidth: '4rem' }}
                      className="btn me-4 font-8 px-1 py-1"
                      onClick={() => {
                        setIsAddModalVisible(-1)
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      ref={ref => {
                        if (ref) {
                          ref.style.setProperty('text-align', 'center', 'important')
                        }
                      }}
                      type="submit"
                      className="btn font-8 px-1 py-1"
                      style={{ minWidth: '4rem' }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModal}
        centered
        size="lg"
        onHide={() => {
          setShowModal(false)
        }}
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
          }}
        >
          <Modal.Title>Reorder Products</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            textAlign: 'center',
            borderBottom: '0',
            fontWeight: '600',
          }}
        >
          <SortableContainer onSortEnd={onSortEnd}>
            {productList.map((value, index) => (
              <SortableItem key={`item-${value.name}`} index={index} value={value} />
            ))}
          </SortableContainer>
          <div>
            <div>
              <button
                ref={ref => {
                  if (ref) {
                    ref.style.setProperty('background-color', 'white', 'important')
                    ref.style.setProperty('color', 'var(--bgColor2)', 'important')
                    ref.style.setProperty('font-size', '0.8rem', 'important')
                    ref.style.setProperty('text-align', 'center', 'important')
                  }
                }}
                className="btn me-4 font-8 px-1 py-1"
                onClick={() => {
                  setShowModal(false)
                }}
                style={{ minWidth: '4rem' }}
              >
                Cancel
              </button>
              <button
                ref={ref => {
                  if (ref) {
                    ref.style.setProperty('text-align', 'center', 'important')
                  }
                }}
                className="btn font-8 px-1 py-1"
                onClick={() => {
                  reorderProducts()
                }}
                style={{ minWidth: '4rem' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={isDeleteModalVisible !== -1}
        centered
        onHide={() => {
          setIsDeleteModalVisible(-1)
        }}
      >
        {/* <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
          }}
        >
          <Modal.Title>Are you sure you want to delete</Modal.Title>
        </Modal.Header> */}
        <Modal.Body
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            borderBottom: '0',
            fontWeight: '600',
          }}
        >
          <div className="col">
            <div className="row">
              <div className="h4">Are you sure you want to delete</div>
            </div>
            <div className="row">
              <div className="py-3">
                The {isDeleteModalVisible === 0 ? ' quick links' : ' my favourites'} of{' '}
                {selectedItem?.name} will be deleted
              </div>
            </div>
            <div className="row">
              <div>
                <button
                  ref={ref => {
                    if (ref) {
                      ref.style.setProperty('background-color', 'white', 'important')
                      ref.style.setProperty('color', 'var(--bgColor2)', 'important')
                      ref.style.setProperty('font-size', '0.8rem', 'important')
                      ref.style.setProperty('text-align', 'center', 'important')
                    }
                  }}
                  className="btn me-4 font-8 px-1 py-1"
                  onClick={() => {
                    setIsDeleteModalVisible(-1)
                  }}
                  style={{ minWidth: '4rem' }}
                >
                  Cancel
                </button>
                <button
                  ref={ref => {
                    if (ref) {
                      ref.style.setProperty('text-align', 'center', 'important')
                    }
                  }}
                  className="btn font-8 px-1 py-1"
                  onClick={() => {
                    if (isDeleteModalVisible === 0) {
                      deleteQuickLinks(selectedItem.id)
                      setIsDeleteModalVisible(-1)
                    } else if (isDeleteModalVisible === 1) {
                      deleteFavLinks(selectedItem.id)
                      setIsDeleteModalVisible(-1)
                    }
                  }}
                  style={{ minWidth: '4rem' }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        ></Modal.Footer> */}
      </Modal>
    </>
  )
}

export default Home
