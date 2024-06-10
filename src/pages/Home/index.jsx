import React, { Suspense } from "react";
import SupportSections from "./SupportSections";
import SubscribeSection from "../../components/SubscribeSection";
import loader from "../../assets/images/loader.gif";


const TopSection = React.lazy(() => import("./TopSection/TopSection"));
const FeaturedCategories = React.lazy(() =>
  import("./FeaturedCategories/FeaturedCategories")
);
const TopMobileBrands = React.lazy(() =>
  import("./TopMobileBrands/TopMobileBrands")
);
const AdminFeaturedSections = React.lazy(() =>
  import("./AdminFeaturedSections/AdminFeaturedSections")
);
const FeaturedProducts = React.lazy(() =>
  import("./FeaturedProducts/FeaturedProducts")
);

const Home = () => {
  return (
    <>
      <Suspense fallback={<Loader/>}>
        <TopSection />
      </Suspense>
      <SupportSections />
      <Suspense fallback={<Loader/>}>
        <FeaturedCategories />
        <TopMobileBrands />
        <AdminFeaturedSections />
        <FeaturedProducts />
      </Suspense>
      <SubscribeSection />
    </>
  );
};

export default Home;


const Loader = () => (
  <div style={loaderStyle}>
    <img src={loader} alt="Loading..." style={{ width: "100px" }} />
  </div>
);

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};
