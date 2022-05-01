import React from 'react'
import { getToken, getUserRoles } from '../../utils/token'
import { useLoading } from '../../utils/LoadingContext'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import PrimaryHeading from '../../components/Primary Headings'
import API from '../../utils/api'
import HomeCard from '../../components/ProductCard/HomeCard'
const Home = () => {
  const isAdmin =
    getUserRoles() == 'Technical Administrator' ||
    getUserRoles() == 'PMK Administrator' ||
    getUserRoles() == 'PMK Content Manager'

  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [home, setHome] = React.useState(null)

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

  console.log(home)

  const HomeCardComponent = ({ title, data, isImage = false, image }) => {
    if (!isImage)
      return (
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="card-header-title">{title}</div>
              {data &&
                data.map((item, idx) => (
                  <div className="card-header-items" role={'button'}>
                    {item.link_text}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )
    else
      return (
        <div className="col">
          <div className="card">
            <div className="card-body"></div>
          </div>
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
      <div className="row mx-2 mx-md-5 h-100">
        <div className="col center py-md-3">
          <PrimaryHeading title={'Home'} />
          <div className="row mt-4">
            <HomeCardComponent title={'Quick Links'} data={home?.quick_links} />
            <HomeCardComponent title={'My Favourites'} data={home?.my_favorites} />
          </div>
          <div className="row mt-4">
            <div>Product Related Information</div>
            {home?.product_related_info.map((item, index) => (
              <HomeCard item={item} index={index} onClick={() => {}} onUpdate={() => {}} />
            ))}
          </div>
          <div className="row mt-4 mb-4">
            <div className="col-8">
              <div className="ryg-header-title">RYG Information</div>
              <div className="align-self-center">
                <div className="ryg-text mt-5">
                  Download the FlowConfigurator, get Service information, Lead-time table register
                  for Trainings, Application Notes and many more
                </div>
              </div>
            </div>
            <div className="col-4">
              <img src="https://source.unsplash.com/random" className="home-ryg-img shadow" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
