import React from "react";
const columns = [
  { name: "No", uid: "id", sortable: true },
    { name: "Id Facture", uid: "id_fac" },
    { name : "Nom du Résident", uid: "nom" },
    { name: "Type de Facture", uid: "type", sortable: true },
    { name: "Mois Consommation", uid: "mois"},
    { name: "Echéance", uid: "echeance" },
    { name: "Status", uid: "status", sortable: true },
    { name: "Montant TTC", uid: "ttc" },
    { name: "Actions", uid :"actions"},
];

const users = [
  { id: 2, id_fac: "#1313313", type: "Eau", mois: "02/22/2024", echeance: "02/22/2024", status: "en retard", ttc: "$10" },
  { id: 3, id_fac: "#1313313", type: "Eau", mois: "02/22/2024", echeance: "02/22/2024", status: "en attente", ttc: "$10" },
  { id: 4, id_fac: "#1313313", type: "Eau", mois: "02/22/2024", echeance: "02/22/2024", status: "payée", ttc: "$10" },
  { id: 5, id_fac: "#1313313", type: "Eau", mois: "02/22/2024", echeance: "02/22/2024", status: "payée", ttc: "$10" },
  { id: 6, id_fac: "#1313313", type: "Eau", mois: "02/22/2024", echeance: "02/22/2024", status: "payée", ttc: "$10" },
  { id: 7, id_fac: "#1313313", type: "Eau", mois: "01/01/2025", echeance: "02/22/2024", status: "en retard", ttc: "$10" },
  { id: 8, id_fac: "#1313313", type: "Eau", mois: "02/22/2024", echeance: "02/22/2024", status: "en attente", ttc: "$10" },
  { id: 9, id_fac: "#1313313", type: "Eau", mois: "02/22/2024", echeance: "02/22/2024", status: "payée", ttc: "$10" },
  { id: 10, id_fac: "#1313313", type: "Eau", mois: "02/22/2024", echeance: "02/22/2024", status: "payée", ttc: "$10" },
  { id: 1, id_fac: "#1313313",  type: "Eau", mois: "02/22/2024", echeance: "02/22/2024", status: "payée", ttc: "$10" },
  ];

const statusOptions = ["payée", "en retard", "en attente"];

export {columns, users, statusOptions};