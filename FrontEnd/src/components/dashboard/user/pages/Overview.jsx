import React, { useState, useEffect } from "react";
import PieChartCard from "./components/pie";
import DataTable from "./components/table";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./Overview.scss";
import {Button} from "@nextui-org/react";

const Overview = () => {
  const data1 = [
    { id: "total-payé", label: "Total Payé", value: 42, color: "#96A7FF" },
    { id: "total-en-retard", label: "Total En Retard", value: 20.1, color: "#5F284A" },
    { id: "total-impayé", label: "Total Impayé", value: 38.5, color: "#282230" },
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
      etat: "Pending",
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
      etat: "Paid",
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
      etat: "Overdue",
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
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container-fluid">
      <h1>resident overview</h1>
    </div>
  );
};

export default Overview;
