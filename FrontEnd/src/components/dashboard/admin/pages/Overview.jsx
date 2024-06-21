// Overview.jsx

import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PieChartCard from "./components/pie";
import DataTable from "./components/oveTab";
import "./Overview.scss";
import { columns } from "./components/data";
import { useDispatch, useSelector } from "react-redux";
import { fetchFactureThunk, fetchStatisticsThunk } from "../../../../session/thunks/adminthunk";

const data1 = [
  { id: "total-payé", label: "Total Payé", value: 42, color: "#96A7FF" },
  { id: "total-en-retard", label: "Total En Retard", value: 20.1, color: "#5F284A" },
  { id: "total-impayé", label: "Total Impayé", value: 38.5, color: "#282230" },
];

const data2 = [
  { id: "total-occupé", label: "Total Occupé", value: 80, color: "#F9769D" },
  { id: "total-vacant", label: "Total Vacant", value: 20, color: "#282230" },
];

const Overview = () => {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const factures = useSelector((state) => state.facture.factures);
  const statistics = useSelector((state) => state.statistics.statistics);
  const [filteredFactures, setFilteredFactures] = useState([]);

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
    const filtered = factures.filter(
      (facture) => facture.fac_etat === "retard" || facture.fac_etat === "attente"
    ).slice(0, 6); // Adjusted to slice(0, 6)
    setFilteredFactures(filtered);
  }, [factures]);

  // Transform filtered factures data to match the table's expected structure
  const transformedFactures = filteredFactures.map((facture) => ({
    id: facture.fac_id,
    id_res: facture.res_id,
    nom: facture.nom,
    type: facture.fac_type,
    mois: facture.fac_date,
    echeance: facture.fac_echeance,
    status: facture.fac_etat,
    ttc: facture.fac_total,
  }));

  return (
    <div className="container mx-auto">
      {isMobile ? (
        <Carousel showArrows={false} showStatus={false} showThumbs={false}>
          <div className="carousel-item-wrapper">
            <PieChartCard title="Statistique Des Factures" data={data1} />
          </div>
          <div className="carousel-item-wrapper">
            <PieChartCard title="Statistique Des Logements" data={data2} />
          </div>
        </Carousel>
      ) : (
        <div className="flex flex-wrap justify-around">
          <div className="w-full md:w-1/2 p-2">
            <PieChartCard title="Statistique Des Factures" data={data1} />
          </div>
          <div className="w-full md:w-1/2 p-2">
            <PieChartCard title="Statistique Des Logements" data={data2} />
          </div>
        </div>
      )}
      <div className="w-full">
        <DataTable columns={columns} rows={transformedFactures} title="Factures récentes" />
      </div>
    </div>
  );
};

export default Overview;
