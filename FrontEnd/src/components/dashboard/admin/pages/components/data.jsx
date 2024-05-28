import React from "react";
const columns = [
  {name: "No", uid: "id"},
  {name: "Id Residant", uid: "id_res"},
  {name: "Nom du Residant", uid: "nom"},
  {name: "Type de Facture", uid: "type"},
  {name: "Mois Consommation", uid: "mois"},
  {name: "Echeance", uid: "echeance"},
  {name: "Status", uid: "status"},
  {name: "Montant TTC", uid: "ttc"},
];

const users = [
  {id: 1,id_res: "#1313313",nom: "Tony Reichert",type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "payé",ttc: "$10",},
  {id: 2,id_res: "#1313313",nom: "Tony Reichert",type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "retard",ttc: "$10",},
  {id: 3,id_res: "#1313313",nom: "Tony Reichert",type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "attente",ttc: "$10",},
  {id: 4,id_res: "#1313313",nom: "Tony Reichert",type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "payé",ttc: "$10",},
  {id: 5,id_res: "#1313313",nom: "Tony Reichert",type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "payé",ttc: "$10",},
];

export {columns, users};
