import React, { useState, useEffect } from "react";
import PieChartCard from "./components/pie";
import DataTable from "./components/table";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./Overview.scss";
import Box from '@mui/material/Box';

const Overview = () => {
  const data1 = [
    { id: "total-payé", label: "total payé", value: 42, color: "#96A7FF" },
    { id: "total-en-retard", label: "total en retard", value: 20.1, color: "#5F284A" },
    { id: "total-impayé", label: "total impayé", value: 38.5, color: "#282230" },
  ];

  const data2 = [
    { id: "total-occupé", label: "Total Occupé", value: 80, color: "#F9769D" },
    { id: "total-vacant", label: "Total Vacant", value: 20, color: "#282230" },
  ];

  const rows = [
    {
      key: "1",
      No: "1",
      id: "#1313313",
      nom: "Dmitry Lauretsky",
      Type: "Eau",
      Mois: "01/2024",
      echeance: "22/02/2024",
      etat: "pending",
      ttc: "$10",
    },
    {
      key: "2",
      No: "1",
      id: "#1313313",
      nom: "Dmitry Lauretsky",
      Type: "Eau",
      Mois: "01/2024",
      echeance: "22/02/2024",
      etat: "pending",
      ttc: "$10",
    },
    {
      key: "3",
      No: "1",
      id: "#1313313",
      nom: "Dmitry Lauretsky",
      Type: "Eau",
      Mois: "01/2024",
      echeance: "22/02/2024",
      etat: "pending",
      ttc: "$10",
    },
  ];

  const columns = [
    {
      key: "No",
      label: "No",
    },
    {
      key: "id",
      label: "Id Residant",
    },
    {
      key: "nom",
      label: "Nom du Residant",
    },
    {
      key: "Type",
      label: "Type de facture",
    },
    {
      key: "Mois",
      label: "Mois Consommation",
    },
    {
      key: "echeance",
      label: "Echéance",
    },
    {
      key: "etat",
      label: "Etat",
    },
    {
      key: "ttc",
      label: "Montant TTC",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container-fluid">
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
        <div className="row justify-content-around">
          <div className="col-md-6">
            <PieChartCard title="Statistique Des Factures" data={data1} />
          </div>
          <div className="col-md-6">
            <PieChartCard title="Statistique Des Logements" data={data2} />
          </div>
        </div>
      )}
      {/* <DataTable columns={columns} rows={rows} /> */}
    </div>
  );
};

export default Overview;
