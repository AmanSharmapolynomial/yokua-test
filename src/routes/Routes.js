import React from 'react'
import ProfileSettingScreen from '../screens/Profile Setting'
import { Route, Routes } from 'react-router-dom'
import UserListView from '../screens/Admin Screens/User List View'
import UserApprovalScreen from '../screens/Admin Screens/User Approval Request'
import SignIn from '../components/Sign In'
import SignUp from '../components/Sign Up'
import InfoComponent from '../components/Info'
import AdminScreens from '../screens/Admin Screens'
import Forgot from '../components/Forgot Password/Forgot'
import ChnagePassword from '../components/Forgot Password/ChangePassword'
import HomeScreen from '../screens/Home Screen'
import PrivateRoute from './PrivateRoute'
import AuthLayout from '../layouts/AuthLayout'
import Header from '../components/Header'
import TermsPolicy from '../components/Terms Privacy/TermsPolicy'
import { getToken, getUserRoles } from '../utils/token'
import NewsScreen from '../screens/News Screen/NewsScreen'
import EventScreen from '../screens/Event Screen'
import VerificationEmail from '../components/Modals/VerificationEmail/VerificationEmail'
import AddEventScreen from '../screens/Event Screen/addEvent'
import Footer from '../components/Footer'
import CompanyNames from '../screens/Admin Screens/CompanyNames/CompanyNames'
import Rotameter from '../screens/Admin Screens/Product Lines/Rotameter'
import ResetPasswordModal from '../components/Modals/Reset Password Modal'
import ProductLine from '../screens/ProductLine/ProductLine'
import SubProduct from '../screens/ProductLine/SubProduct'
import ProductDetail from '../screens/ProductLine/ProductDetail'
import Tokuchu from '../screens/Admin Screens/Tokuchu/Tokuchu'
import Impressum from '../components/Impressum'
import PrivacyPolicy from '../components/PrivacyPolicy'
import Contact from '../screens/contact/Contact'
import EventManagement from '../screens/Admin Screens/EventManagement/EventManagement'
import RYG from '../screens/RYG/RYG'
import RYGDetail from '../screens/RYG/RYGDetail'
import Search from '../screens/Search/Search'
import Home from '../screens/Home/Home'
import EventDetail from '../screens/Event Screen/EventDetail'
import PageNotFound from '../screens/404/404'

const Routing = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/auth"
          element={
            <React.Fragment>
              <Header />
              <AuthLayout />
            </React.Fragment>
          }
        >
          <Route
            path="login"
            element={
              <React.Fragment>
                <div className="bg-landing d-flex align-items-center justify-content-center h-100">
                  <div className="col">
                    <InfoComponent />
                    <SignIn />
                  </div>
                </div>
              </React.Fragment>
            }
          />
          <Route
            path="register"
            element={
              <div className="bg-landing d-flex align-items-center justify-content-center h-100">
                <div className="col">
                  <SignUp />
                </div>
              </div>
            }
          />
          <Route
            path="forgot-password"
            element={
              <div className="bg-landing d-flex align-items-center justify-content-center h-100">
                <div className="col">
                  <Forgot />
                </div>
              </div>
            }
          />
          <Route
            path="reset-password"
            element={
              <div className="bg-landing d-flex align-items-center justify-content-center h-100">
                <div className="col">
                  <ResetPasswordModal />
                </div>
              </div>
            }
          />
          <Route
            path="reset-password/:uid/:token"
            element={
              <div className="bg-landing d-flex align-items-center justify-content-center h-100">
                <div className="col">
                  <ChnagePassword />
                </div>
              </div>
            }
          />
          <Route
            path="terms-privacy"
            element={
              <div className="bg-landing d-flex align-items-center justify-content-center h-100">
                <TermsPolicy />
              </div>
            }
          />
          <Route
            path="verification-email"
            element={
              <div className="bg-landing d-flex align-items-center justify-content-center h-100">
                <div className="col">
                  <VerificationEmail />
                </div>
              </div>
            }
          />
          <Route
            path="verification-email/:uid/:token"
            element={
              <div className="bg-landing d-flex align-items-center justify-content-center h-100">
                <div className="col">
                  <VerificationEmail />
                </div>
              </div>
            }
          />
        </Route>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminScreens />
            </PrivateRoute>
          }
        >
          <Route path="user/list-view" element={<UserListView />} />

          <Route path="user/company-names" element={<CompanyNames />} />

          {/* <Route path="products" element={<ProductList />} /> */}
          <Route path="rotameter" element={<Rotameter />} />
          <Route path="approved-tokuchus" element={<Tokuchu />} />
          {/* <Route path="sub-products/:id" element={<SubProductList />} /> */}
          <Route path="product-detail/:id" element={<ProductDetail />} />
          <Route
            path="user/approval-request"
            element={
              <React.Fragment>
                <UserApprovalScreen />
              </React.Fragment>
            }
          />
          <Route
            path="event"
            element={
              <PrivateRoute>
                <EventManagement />
              </PrivateRoute>
            }
          />
          {/* <Route path="*" element={<Navigate to="/profile" />} /> */}
        </Route>
        <Route
          path="news"
          element={
            <PrivateRoute>
              <NewsScreen />
              {/* <Footer/> */}
            </PrivateRoute>
          }
        />
        <Route
          path="/product-lines"
          element={
            <PrivateRoute>
              <ProductLine archieve={false} />
            </PrivateRoute>
          }
        />
        <Route
          path="/product-lines/archive"
          element={
            <PrivateRoute>
              <ProductLine archieve={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/product-lines/sub-product"
          element={
            <PrivateRoute>
              <SubProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/product-lines/product-detail"
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/ryg-information"
          element={
            <PrivateRoute>
              <RYG />
            </PrivateRoute>
          }
        />
        <Route
          path="/ryg-information/details"
          element={
            <PrivateRoute>
              <RYGDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/search/:query"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfileSettingScreen />
              {/* <Footer/> */}
            </PrivateRoute>
          }
        />
        <Route
          path="contact"
          element={
            <PrivateRoute>
              <Contact />
            </PrivateRoute>
          }
        />
        <Route
          path="/impressum"
          element={
            <>
              <Header
                isLogedIn={getToken()}
                isAdmin={
                  getUserRoles() == 'Technical Administrator' ||
                  getUserRoles() == 'PMK Administrator'
                }
              />
              <div className="d-flex justify-content-center h-100">
                <div className="col">
                  <Impressum />
                </div>
              </div>
            </>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <>
              <Header
                isLogedIn={getToken()}
                isAdmin={
                  getUserRoles() == 'Technical Administrator' ||
                  getUserRoles() == 'PMK Administrator'
                }
              />
              <div className="d-flex justify-content-center h-100">
                <div className="col">
                  <PrivacyPolicy />
                </div>
              </div>
            </>
          }
        />
        <Route
          path="event/all"
          element={
            <PrivateRoute>
              <EventScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="event/add"
          element={
            <PrivateRoute>
              <AddEventScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="event/update/:eventId"
          element={
            <PrivateRoute>
              <AddEventScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="event/details"
          element={
            <PrivateRoute>
              <EventDetail />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </React.Fragment>
  )
}

export default Routing
