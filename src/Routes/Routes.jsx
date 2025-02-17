import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import Header from "../Pages/Header";
import ForgotPasswordAndReset from "../Pages/ForgotPasswordAndReset";
import Collection from "../Pages/Collection";
import OrganicFront from "../Pages/UI/OrganicFront";
import Blogposts from "../Pages/Blogposts";
import BestFungicides from "../Pages/Fungicides/BestFungicides";
import BestInsecticides from "../Pages/Insecticide/BestInsecticides";
import Recentlyviewed from "../Pages/Recentlyviewed";
import Footer from "../Pages/Footer";
import BuyNow from "../Pages/BuyNow";
import LogIn from "../Pages/LogIn";
import ShowFungicides from "../Pages/Fungicides/ShowFungicides";
import PlantGrowthRegulator from "../Pages/Plantgrowthregulator/PlantGrowthRegulator";
import PGRShowProduct from "../Pages/Plantgrowthregulator/PGRShowProduct";
import Organic from "../Pages/Organicproduct/Organic";
import ShowOrganic from "../Pages/Organicproduct/ShowOrganic";
import Cart from "../Pages/Cart";
import ShowMicroProduct from "../Pages/MicroNutrients/ShowMicroProduct";
import Micronutrients from "../Pages/MicroNutrients/Micronutrients";
import ShowInsecticide from "../Pages/Insecticide/ShowInsecticide";
import Insecticide from "../Pages/UI/Insecticide";
import Fungicides from "../Pages/UI/Fungicide";
import CreateAcc from "../Pages/CreateAcc";
import Profile from "../Pages/Profile";
import Categories from "../Pages/Categories";

import MicronutrientUI from "../Pages/UI/MicronutrientUI";
import Plantgrowthregulator from "../Pages/UI/Plantgrowthregulator";
import CheckOut from "../Pages/CheckOut";
import OrderCompleted from "../Pages/OrderCompleted";
import Orders from "../Pages/Orders";
import CartProductDetails from "../Pages/CartProductDetails";
import Messages from "../Pages/Messages";
import { FaComments } from "react-icons/fa"; // For chat icon
import GoogleCallback from "../Pages/GoogleCallback";
import SearchProductDetails from "../Pages/SearchProductDetails";
import Settings from "../Pages/Settings";
import HelpCenter from "../Pages/HelpCenter";
import { useAuth } from "../actions/authContext";
import TrackOrder from "../Pages/TrackOrder ";


const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null;
}

const AppRoutes = () => {
  const { authenticatedUser } = useAuth();
  const [isChatVisible, setIsChatVisible] = useState(false); // State to control chat visibility
  return (
    <Router>
      <div
        className="fixed bottom-5 right-5 bg-green-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-green-600 transition"
        onClick={() => setIsChatVisible((prev) => !prev)}
      >
        <FaComments size={43} />
      </div>
      {/* Chat Component (conditionally rendered) */}
      {isChatVisible && (
        <div
          className={`fixed top-36 right-0 w-auto h-[calc(100vh-64px)] bg-white shadow-lg border-r border-gray-300 z-50 transition-transform ${isChatVisible ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <Messages onClose={() => setIsChatVisible(false)} username={authenticatedUser.username} room="general" />
        </div>

      )}
      <Header />
      <ScrollToTop />
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/orders" component={Orders} />
        <Route path="/settings" component={Settings} />
        <Route path="/helpcenter" component={HelpCenter} />
        <Route path="/ForgotPasswordAndReset" component={ForgotPasswordAndReset} />
        {/* For Become a seller */}

        {/* Routes for Plant Growth Regulator */}
        <Route path="/plantgrowthregulator/:productId" component={PGRShowProduct} />
        <Route path="/plantgrowthregulator" component={PlantGrowthRegulator} />
        <Route path="/cart" component={Cart} />

        {/* Routes for Fungicides */}
        <Route path="/fungicides/:productId" component={ShowFungicides} />
        <Route path="/fungicides" component={BestFungicides} />

        <Route path="/insecticide/:productId" component={ShowInsecticide} />
        <Route path="/insecticide" component={BestInsecticides} />

        {/* This is for organic product */}
        <Route path="/organicproduct/:productId" component={ShowOrganic} />
        <Route path="/organicproduct" component={Organic} />

        {/* This is for Micro Nutrients */}
        <Route path="/micro-nutrients/:productId" component={ShowMicroProduct} />
        <Route path="/micro-nutrients" component={Micronutrients} />

        {/* Route for Buy Now */}
        <Route path="/BuyNow" component={BuyNow} />
        <Route path="/checkout" component={CheckOut} />

        {/* Route for Log In */}
        <Route path="/Signin" component={LogIn} />
        {/* Route for SignUp */}
        <Route path="/Signup" component={CreateAcc} />
        <Route path="/categories" component={Categories} />
        <Route path="/cartproduct/:id" component={CartProductDetails} />
        <Route path="/searchproduct/:id" component={SearchProductDetails} />
        <Route path="/track-order/:orderId" component={TrackOrder} />
        <Route path="/order-completed" component={OrderCompleted} />
        <Route path="/auth/google/callback" component={GoogleCallback} />
      </Switch>

      {/* Common components rendered only on the home page */}
      <Route
        render={({ location }) => {
          if (location.pathname === "/") {
            return (
              <>
                <Collection />
                <Plantgrowthregulator />
                <OrganicFront />
                <MicronutrientUI />
                <Blogposts />
                <Fungicides />
                <Insecticide />
                <Recentlyviewed />
              </>
            );
          }
        }}
      />

      {/* Footer rendered on all pages */}
      <Footer />
    </Router>
  );
};

export default AppRoutes;