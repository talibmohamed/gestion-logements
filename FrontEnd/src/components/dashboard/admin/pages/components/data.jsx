import React from "react";
const columns = [
  {name: "Id Facture", uid: "id"},
  {name: "Nom du Résidant", uid: "nom"},
  {name: "Type de Facture", uid: "type"},
  {name: "Mois Consommation", uid: "mois"},
  {name: "Echeance", uid: "echeance"},
  {name: "Status", uid: "status"},
  {name: "Montant TTC", uid: "ttc"},
  {name:"Action", uid: "actions"},
];

const users = [
  {id: 1,id_fac: "#1313313",nom: "Tony Reichert",type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "payée",ttc: "$10",},
  {id: 2,id_fac: "#1313313",nom: "Tony Reichert",type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "en retard",ttc: "$10",},
  {id: 3,id_fac: "#1313313",nom: "Tony Reichert",type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "en attente",ttc: "$10",},
  {id: 4,id_fac: "#1313313",nom: "Tony Reichert",type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "payée",ttc: "$10",},
  {id: 5,id_fac: "#1313313",nom: "Tony Reichert",type: "Eau",mois: "01/2024",echeance: "22/02/2024",status: "payée",ttc: "$10",},
];

export {columns, users};
