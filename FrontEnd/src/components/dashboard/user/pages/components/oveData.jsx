import React from "react";
const columns = [
  {name: "Id Residant", uid: "id_res"},
  {name: "Type de Facture", uid: "type"},
  {name: "Mois Consommation", uid: "mois"},
  {name: "Echeance", uid: "echeance"},
  {name: "Status", uid: "status"},
  {name: "Montant TTC", uid: "ttc"},
];

const users = [
  {id: 1,id_res: "#1313313", type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "payée",ttc: "$10",},
  {id: 2,id_res: "#1313313", type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "en retard",ttc: "$10",},
  {id: 3,id_res: "#1313313", type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "en attente",ttc: "$10",},
  {id: 4,id_res: "#1313313", type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "payée",ttc: "$10",},
  {id: 5,id_res: "#1313313", type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "payée",ttc: "$10",},
];

export {columns, users};
