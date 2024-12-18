import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PieChartCard from "./components/pie";
import Graph from "./components/graph.jsx";
import "./Overview.scss";
import { columns } from "./components/data";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFactureThunk,
  fetchStatisticsThunk,
} from "../../../../session/thunks/adminthunk";

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
    const filtered = factures
      .filter(
        (facture) =>
          facture.fac_etat === "En Retard" || facture.fac_etat === "En Attente"
      )
      .slice(0, 6); // Adjusted to slice(0, 6)
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

  // Extract statistics data for pie charts
  const factureStatistics = [
    {
      id: "total-payé",
      label: "Total Payé",
      value: statistics?.facture?.total_paid_count || 0,
      color: "#96A7FF",
    },
    {
      id: "total-en-retard",
      label: "Total En Retard",
      value: statistics?.facture?.total_overdue_count || 0,
      color: "#5F284A",
    },
    {
      id: "total-impayé",
      label: "Total Impayé",
      value: statistics?.facture?.total_unpaid_count || 0,
      color: "#282230",
    },
  ];

  // Calculate logement statistics dynamically
  const logementStatuses = ["disponible", "en maintenance", "occupé"];

  const colors = {
    disponible: "#96A7FF", // Green
    "en maintenance": "#5F284A", // Yellow
    occupé: "#f7769d", // Pink
  };

  const totalLogements = statistics?.logement?.total_logements_count || 0;
  const logementStatistics = logementStatuses.map((statut) => ({
    id: `total-${statut}`,
    label: `Total ${statut.charAt(0).toUpperCase() + statut.slice(1)}`,
    value: statistics?.logement?.[statut] || 0,
    color: colors[statut],
  }));

  // Calculate occupied percentage for label
  const totalOccupied = statistics?.logement?.occupé || 0;
  const occupiedPercentage =
    totalLogements > 0 ? (totalOccupied / totalLogements) * 100 : 0;
  const logementStatisticsLabel = `${totalLogements} Logements`;

  // Label for factureStatistics to display the total of factures
  const FactureStatisticsLabel =
    (statistics?.facture?.total_paid_count || 0) +
    (statistics?.facture?.total_overdue_count || 0) +
    (statistics?.facture?.total_unpaid_count || 0) +
    " Factures";

  const sampleData = [
    {
      label: "Disponible",
      data: statistics?.logement_history?.disponible || [0, 0, 0, 0, 0, 0],
      color: colors.disponible,
    },
    {
      label: "Occupé",
      data: statistics?.logement_history?.occupe || [0, 0, 0, 0, 0, 0],
      color: colors.occupé,
    },
    {
      label: "En Maintenance",
      data: statistics?.logement_history?.en_maintenance || [0, 0, 0, 0, 0, 0],
      color: colors["en maintenance"],
    },
  ];

  let xLabels = statistics?.logement_history?.months || [
    "Janvier",
    "Fevrier",
    "Mars",
    "Avril",
    "May",
    "Juin",
  ];

  return (
    <div className="container mx-auto">
      {isMobile ? (
        <>
          <div className="carousel-item-wrapper">
            <PieChartCard
              title="Statistique Des Factures"
              data={factureStatistics}
              label={FactureStatisticsLabel}
            />
          </div>
          <div className="carousel-item-wrapper">
            <PieChartCard
              title="Statistique Des Logements"
              data={logementStatistics}
              label={logementStatisticsLabel}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-wrap justify-around">
          <div className="w-full md:w-1/2 p-2">
            <PieChartCard
              title="Statistique Des Factures"
              data={factureStatistics}
              label={FactureStatisticsLabel}
            />
          </div>
          <div className="w-full md:w-1/2 p-2">
            <PieChartCard
              title="Statistique Des Logements"
              data={logementStatistics}
              label={logementStatisticsLabel}
            />
          </div>
        </div>
      )}
      <div className="w-full">
        {/* <DataTable
          columns={columns}
          rows={transformedFactures}
          title="Factures récentes"
        /> */}
        <Graph
          title="Graphe linéaire des logements"
          data={sampleData}
          xLabels={xLabels}
        />
      </div>
    </div>
  );
};

export default Overview;
