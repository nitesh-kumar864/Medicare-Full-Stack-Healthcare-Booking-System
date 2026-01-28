import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";
import DoctorSkeletonGrid from "../components/skeletons/DoctorSkeletonGrid";
import { AppContext } from "../context/AppContext";

const Home = () => {
  const { getDoctorsData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await getDoctorsData();
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      <Header />
      <SpecialityMenu />

       {loading ? <DoctorSkeletonGrid /> : <TopDoctors />}

      <Banner />
    </div>
  );
};

export default Home;
