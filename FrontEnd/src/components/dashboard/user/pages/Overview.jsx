import React from "react";
import PieChartCard from "./components/pie";
import DataTable from "./components/table";
import "./Overview.scss";

const Overview = () => {
  const data1 = [
    { label: "total payé", value: 42, color: "#96A7FF" },
    { label: "total en retard", value: 20.1, color: "#5F284A" },
    { label: "total impayé", value: 38.5, color: "#f9769d0f" },
  ];


  /*
  
  
  */ 
 
  const data2 = [
    { label: "Total Occupé", value: 80, color: "#F9769D" },
    { label: "Total Vacant", value: 20, color: "#f9769d0f" },
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

  return (
    <div className="overview-container">
      <div className="overview-chart">
        <PieChartCard title="Statistique Des Factures" data={data1} />
        <PieChartCard title="Statistique Des Logements" data={data2} />
      </div>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default Overview;
