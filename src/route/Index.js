import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ProductContextProvider } from "../pages/pre-built/products/ProductContext";
import { RedirectAs404 } from "../utils/Utils";
import KycListRegular from "../pages/pre-built/kyc-list-regular/KycListRegular";
import KycDetailsRegular from "../pages/pre-built/kyc-list-regular/kycDetailsRegular";
import ProductCard from "../pages/pre-built/products/ProductCard";
import ProductList from "../pages/pre-built/products/ProductList";
import ProductDetails from "../pages/pre-built/products/ProductDetails";
import Setting from "../pages/pre-built/setting/Settings";
import Withdraw from "../pages/pre-built/withdraw/Withdraw";
import DepositReport from "../pages/pre-built/deposit/DepositReport";
import WithdrawDetail from "../pages/pre-built/withdraw/WithdrawDetail";
import Wallet from "../pages/pre-built/wallet/Wallet"; 
import BIClients from "../pages/pre-built/bi/BIClient";
import BIClientDetail from "../pages/pre-built/bi/BIClientDetail";
import Administrator from "../pages/pre-built/administrator/Administrator";
import SocialAccountDetail from "../pages/pre-built/social/SocialAccountDetail";
import SocialAccountList from "../pages/pre-built/social/SocialAccountList";

const Pages = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Suspense fallback={<div />}>
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/administrator`} component={Administrator}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/kyc-list-regular`} component={KycListRegular}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/kyc-details-regular/:id`} component={KycDetailsRegular}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/product-list`} component={ProductList}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/setting`} component={Setting}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/deposit`} component={DepositReport}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/withdraw`} component={Withdraw}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/withdraw_detail/:id`} component={WithdrawDetail}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/wallet`} component={Wallet}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/ib-become`} component={BIClients}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/ib-become-detail/:id`} component={BIClientDetail}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/social-become`} component={SocialAccountList}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/social-become-detail/:id`} component={SocialAccountDetail}></Route>

        <Route // context api added
          exact
          path={`${process.env.PUBLIC_URL}/product-card`}
          render={(props) => (
            <ProductContextProvider>
              <ProductCard />
            </ProductContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/product-details/:id`}
          render={(props) => (
            <ProductContextProvider>
              <ProductDetails {...props} />
            </ProductContextProvider>
          )}
        ></Route>
        <Route path="/" exact render={() => <Redirect to="/kyc-list-regular"/>}/>
        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
