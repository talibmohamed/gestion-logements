import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PieChartCard from "./components/ovePie";
import DataTable from "./components/oveTab";
import "./Overview.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStatisticsThunk,
  fetchFactureThunk,
} from "../../../../session/thunks/userthunks";

import { columns } from "./components/oveData";

const Overview = () => {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const factures = useSelector((state) => state.facture.factures);
  const statistics = useSelector((state) => state.statistics.statistics);
  const [filteredFactures, setFilteredFactures] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchFactureThunk());
        await dispatch(fetchStatisticsThunk());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const filtered = factures
      .filter(
        (facture) =>
          facture.fac_etat === "en retard" || facture.fac_etat === "en attente"
      )
      .slice(0, 6); // Adjusted to slice(0, 6)
    setFilteredFactures(filtered);
  }, [factures]);

  // Transform filtered factures data to match the table's expected structure
  const transformedFactures = filteredFactures.map((facture) => ({
    id: facture.fac_id,
    id_fac: facture.fac_id,

    nom: facture.nom,
    type: facture.fac_type,
    mois: facture.fac_date,
    echeance: facture.fac_echeance,
    status: facture.fac_etat,
    ttc: facture.fac_total,
  }));

  // Prepare data for pie charts
  const consommationEauData = [
    {
      id: "consomme",
      label: "Consommé",
      value: parseInt(statistics?.total_water_used) || 0,
      color: "#96A7FF",
    },
    {
      id: "reste",
      label: "Reste",
      value: parseInt(statistics?.water_quota_left) || 0,
      color: "#282230",
    },
  ];

  const consommationElectriciteData = [
    {
      id: "consomme",
      label: "Consommé",
      value: parseInt(statistics?.total_electricity_used) || 0,
      color: "#F9769D",
    },
    {
      id: "reste",
      label: "Reste",
      value: parseInt(statistics?.electricity_quota_left) || 0,
      color: "#282230",
    },
  ];

  return (
    <div className="container mx-auto">
      {isMobile ? (
        <Carousel showArrows={false} showStatus={false} showThumbs={false}>
          <div className="carousel-item-wrapper">
            <PieChartCard
              title="Statistique Consommation Eau"
              data={consommationEauData}
            />
          </div>
          <div className="carousel-item-wrapper">
            <PieChartCard
              title="Statistique Consommation Électricité"
              data={consommationElectriciteData}
            />
          </div>
        </Carousel>
      ) : (
        <div className="flex flex-wrap justify-around">
          <div className="w-full md:w-1/2 p-2">
            <PieChartCard
              title="Statistique Consommation Eau"
              data={consommationEauData}
            />
          </div>
          <div className="w-full md:w-1/2 p-2">
            <PieChartCard
              title="Statistique Consommation Électricité"
              data={consommationElectriciteData}
            />
          </div>
        </div>
      )}
      <div className="w-full">
        <DataTable
          columns={columns}
          rows={transformedFactures}
          title="Factures récentes"
        />
      </div>
    </div>
  );
};

export default Overview;
