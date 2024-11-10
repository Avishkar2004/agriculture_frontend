import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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

const AppRoutes = () => {
  return (
    <Router>
      <Header />

      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/orders" component={Orders} />
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

        <Route path="/order-completed" component={OrderCompleted} />

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