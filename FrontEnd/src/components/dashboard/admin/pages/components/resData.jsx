import React from "react";
const columns = [
  {name: "Id Résidant", uid: "id_res"},
  {name: "Nom", uid: "nom"},
  {name: "Prénom", uid: "prenom"},
  {name: "Email", uid: "email"},
  {name: "Profession", uid: "profession"},
  {name: "Amelioré", uid: "ameliored"},
  {name: "Téléphone", uid: "telephone"},
  {name: "Action", uid: "actions"},
];

const users = [
    {
        id_res: 1,
        nom: "Dubois",
        prenom: "Jean",
        email: "jean.dubois@example.com",
        profession: "Engineer",
        ameliored: true,
        telephone: "+1234567890",
        
      },
      {

        nom: "Smith",
        prenom: "Emma",
        email: "emma.smith@example.com",
        profession: "Doctor",
        ameliored: false,
        telephone: "+1987654321",
        
      },
      {
        id_res: 3,
        nom: "Garcia",
        prenom: "Luis",
        email: "luis.garcia@example.com",
        profession: "Teacher",
        ameliored: true,
        telephone: "+2468013579",
        
      },
      {
        id_res: 4,
        nom: "Chen",
        prenom: "Wei",
        email: "wei.chen@example.com",
        profession: "Designer",
        ameliored: true,
        telephone: "+1357924680",
      },
      {
        id_res: 5,
        nom: "Ali",
        prenom: "Fatima",
        email: "fatima.ali@example.com",
        profession: "Accountant",
        ameliored: false,
        telephone: "+9876543210",
        
      }
];

export {columns, users};