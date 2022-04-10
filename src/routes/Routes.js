import React, { Children, useEffect, useState } from 'react'
import AdminScreen from '../screens/Admin Screens/User List View'
import ProfileSettingScreen from '../screens/Profile Setting'
import { BrowserRouter as Router, Route, Routes, Redirect } from 'react-router-dom'
import { Navigate } from 'react-router'
import UserListView from '../screens/Admin Screens/User List View'
import UserApprovalScreen from '../screens/Admin Screens/User Approval Request'
import SignIn from '../components/Sign In'
import SignUp from '../components/Sign Up'
import InfoComponent from '../components/Info'
import AdminScreens from '../screens/Admin Screens'
import Forgot from '../components/Forgot Password/Forgot'
import ChnagePassword from '../components/Forgot Password/ChangePassword'
import { useStoreState } from 'easy-peasy'
import { useLocation } from 'react-router'
import HomeScreen from '../screens/Home Screen'
import PrivateRoute from './PrivateRoute'
import AuthLayout from '../layouts/AuthLayout'
import Header from '../components/Header'
import TermsPolicy from '../components/Terms Privacy/TermsPolicy'
import { getToken, getUserRoles } from '../utils/token'
import NewsScreen from '../screens/News Screen/NewsScreen'
import VerificationEmail from '../components/Modals/VerificationEmail/VerificationEmail'
import Footer from '../components/Footer'
import CompanyNames from '../screens/Admin Screens/CompanyNames/CompanyNames'
import Rotameter from '../screens/Admin Screens/Product Lines/Rotameter'
import ApprovedTokuchus from '../screens/Admin Screens/Product Lines/Approved Tokuchus'
import ResetPasswordModal from '../components/Modals/Reset Password Modal'
import ProductLine from '../screens/ProductLine/ProductLine'
import SubProduct from '../screens/ProductLine/SubProduct'
import ProductDetail from '../screens/ProductLine/ProductDetail'
import Tokachu from '../screens/Admin Screens/Tokachu/Tokachu'
import Impressum from '../components/Impressum'
import PrivacyPolicy from '../components/PrivacyPolicy'

const Routing = () => {
  // get User Login Info

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route
          path="/auth"
          element={
            <React.Fragment>
              <Header />
              <AuthLayout />
              {/* <Footer/> */}
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
                {/* <Footer/> */}
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
              {/* <Footer/> */}
            </PrivateRoute>
          }
        >
          <Route path="user/list-view" element={<UserListView />} />

          <Route path="user/company-names" element={<CompanyNames />} />

          {/* <Route path="products" element={<ProductList />} /> */}
          <Route path="rotameter" element={<Rotameter />} />
          <Route path="approved-tokuchus" element={<Tokachu />} />
          {/* <Route path="sub-products/:id" element={<SubProductList />} /> */}
          <Route path="product-detail/:id" element={<ProductDetail />} />
          <Route
            path="user/approval-request"
            element={
              <React.Fragment>
                {/* {getUserRoles() == 'PMK Administrator' ? (
                    <UserApprovalScreen />
                  ) : (
                    <Navigate to="/admin/user/list-view" />
                  )} */}
                <UserApprovalScreen />
              </React.Fragment>
            }
          />
        </Route>
        {/* <Route path="*" element={<Navigate to="/profile" />} /> */}
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
              <ProductLine />
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
          path="profile"
          element={
            <PrivateRoute>
              <ProfileSettingScreen />
              {/* <Footer/> */}
            </PrivateRoute>
          }
        />
        {/* <Route path="*" element={<Navigate to="/profile" />} /> */}

        {/* {(getUserRoles() == 'Technical Administrator') |
          (getUserRoles() == 'PMK Administrator') ? (
            <Route path="*" element={<Navigate to="/user/list-view" />} />
          ) : (
            <Route path="*" element={<Navigate to="/profile" />} />
          )} */}
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
      </Routes>
      <Footer />
    </React.Fragment>
  )
}

export default Routing
