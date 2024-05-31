import React from "react";
const columns = [
  { name: "No", uid: "id", sortable: true },
    { name: "Id Residant", uid: "id_res"},
    { name: "Nom du Residant", uid: "nom" , sortable: true},
    { name: "Type de Facture", uid: "type", sortable: true },
    { name: "Mois Consommation", uid: "mois"},
    { name: "Echeance", uid: "echeance" },
    { name: "Status", uid: "status", sortable: true },
    { name: "Montant TTC", uid: "ttc" },
    {name: "actions", uid: "actions"}
];

const users = [
  { id: 1, id_res: "#1313313", nom: "Tony Reichert", type: "Eau", mois: "01/2024", echeance: "22/02/2024", status: "payé", ttc: "$10" },
    { id: 2, id_res: "#1313313", nom: "Lola Reichert", type: "Eau", mois: "01/2024", echeance: "22/02/2024", status: "retard", ttc: "$10" },
    { id: 3, id_res: "#1313313", nom: "Broke Reichert", type: "Eau", mois: "01/2024", echeance: "22/02/2024", status: "attente", ttc: "$10" },
    { id: 4, id_res: "#1313313", nom: "Laura Reichert", type: "Eau", mois: "01/2024", echeance: "22/02/2024", status: "payé", ttc: "$10" },
    { id: 5, id_res: "#1313313", nom: "Elena Reichert", type: "Eau", mois: "03/2023", echeance: "22/02/2024", status: "payé", ttc: "$10" },
    { id: 6, id_res: "#1313313", nom: "Skye Reichert", type: "Eau", mois: "01/2024", echeance: "22/02/2024", status: "payé", ttc: "$10" },
    { id: 7, id_res: "#1313313", nom: "Joe Reichert", type: "Eau", mois: "01/2025", echeance: "22/02/2024", status: "retard", ttc: "$10" },
    { id: 8, id_res: "#1313313", nom: "Tony Preichert", type: "Eau", mois: "01/2024", echeance: "22/02/2024", status: "attente", ttc: "$10" },
    { id: 9, id_res: "#1313313", nom: "Marie Reichert", type: "Eau", mois: "01/2024", echeance: "22/02/2024", status: "payé", ttc: "$10" },
    { id: 10, id_res: "#1313313", nom: "Willow Reichert", type: "Eau", mois: "01/2024", echeance: "22/02/2024", status: "payé", ttc: "$10" },
  ];

const statusOptions = ["payé", "retard", "attente"];

export {columns, users, statusOptions};