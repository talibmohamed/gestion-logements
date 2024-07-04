import React from "react";
const columns = [
  { name: "No", uid: "id", sortable: true },
    { name: "Id Facture", uid: "fac_id" },
    { name : "Nom du Résident", uid: "nom" },
    { name: "Type de Facture", uid: "fac_type", sortable: true },
    { name: "Mois Consommation", uid: "fac_date"},
    { name: "Echéance", uid: "fac_echeance" },
    { name: "Status", uid: "fac_etat", sortable: true },
    { name: "Montant TTC", uid: "fac_total" },
    { name: "Actions", uid :"actions"},
];

// const users = [
//   { id: 2, fac_id: "#1313313", fac_type: "Eau", fac_date: "02/22/2024", fac_echeance: "02/22/2024", fac_etat: "en retard", fac_total: "$10" },
//   { id: 3, fac_id: "#1313313", fac_type: "Eau", fac_date: "02/22/2024", fac_echeance: "02/22/2024", fac_etat: "en attente", fac_total: "$10" },
//   { id: 4, fac_id: "#1313313", fac_type: "Eau", fac_date: "02/22/2024", fac_echeance: "02/22/2024", fac_etat: "payée", fac_total: "$10" },
//   { id: 5, fac_id: "#1313313", fac_type: "Eau", fac_date: "02/22/2024", fac_echeance: "02/22/2024", fac_etat: "payée", fac_total: "$10" },
//   { id: 6, fac_id: "#1313313", fac_type: "Eau", fac_date: "02/22/2024", fac_echeance: "02/22/2024", fac_etat: "payée", fac_total: "$10" },
//   { id: 7, fac_id: "#1313313", fac_type: "Eau", fac_date: "01/01/2025", fac_echeance: "02/22/2024", fac_etat: "en retard", fac_total: "$10" },
//   { id: 8, fac_id: "#1313313", fac_type: "Eau", fac_date: "02/22/2024", fac_echeance: "02/22/2024", fac_etat: "en attente", fac_total: "$10" },
//   { id: 9, fac_id: "#1313313", fac_type: "Eau", fac_date: "02/22/2024", fac_echeance: "02/22/2024", fac_etat: "payée", fac_total: "$10" },
//   { id: 10, fac_id: "#1313313", fac_type: "Eau", fac_date: "02/22/2024", fac_echeance: "02/22/2024", fac_etat: "payée", fac_total: "$10" },
//   { id: 1, fac_id: "#1313313",  fac_type: "Eau", fac_date: "02/22/2024", fac_echeance: "02/22/2024", fac_etat: "payée", fac_total: "$10" },
//   ];

const statusOptions = ["payée", "en retard", "en attente"];

export {columns, statusOptions};