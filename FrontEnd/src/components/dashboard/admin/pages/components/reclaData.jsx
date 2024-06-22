const columns = [
    { name: "No", uid: "id", sortable: true },
    { name: "Id Réclamation", uid: "id_recl"},
    { name: "Nom du Résidant", uid: "nom" , sortable: true},
    { name: "Type de Réclamation", uid: "type_recl", sortable: true },
    { name: "Description", uid: "desc"},
    { name: "Date de Réclamation", uid: "date"},
    { name: "Status", uid: "status", sortable: true },
    { name: "Date de Résolution", uid: "sol" },
    {name: "Actions", uid: "actions"}
];

const users = [
      {id: 1,id_recl: "R001",nom: "Jean Dupont",type_recl: "Problème de chauffage",desc:"problème de chauffage",date: "2024-01-15",status: "en attente",sol: "--",},
      {id: 2,id_recl: "R002",nom: "Marie Curie",type_recl: "Fuite d'eau dans la salle de bain",desc:"Fuite d'eau dans la salle de bain",date: "2024-02-10",status: "non résolu",sol: "2024-02-17",},
      {id: 3,id_recl: "R003",nom: "Albert Einstein",type_recl: "Problème d'électricité",desc:"problème électricité",date: "2024-03-05",status: "résolu",sol: "2024-03-12",},
      {id: 4,id_recl: "R004",nom: "Isaac Newton",type_recl: "Plomberie défectueuse",desc:"Plomberie défectueuse",date: "2024-04-20",status: "en attente",sol: "--",},
      {id: 5,id_recl: "R005",nom: "Galileo Galilei",type_recl: "Problème de serrure",desc:"problème de serrure",date: "2024-05-10",status: "résolu",sol: "2024-05-15",},
      {id: 6,id_recl: "R006",nom: "Nikola Tesla",type_recl: "Panne de courant",desc:"Panne de courant",date: "2024-06-01",status: "non résolu",sol: "2024-06-08",},
      {id: 7,id_recl: "R007",nom: "Leonardo da Vinci",type_recl: "Problème de climatisation",desc:"problème de climatisation",date: "2024-06-20",status: "En attente",sol: "--",},
      {id: 8,id_recl: "R008",nom: "Ada Lovelace",type_recl: "Fuite de gaz",desc:"Fuite de gaz",date: "2024-07-10",status: "résolu",sol: "2024-07-15",},
      {id: 9,id_recl: "R009",nom: "Alan Turing",type_recl: "Problème de réseau",desc:"problème de réseau",date: "2024-08-05",status: "non résolu",sol: "2024-08-12",},
      {id: 10,id_recl: "R010",nom: "Charles Babbage",type_recl: "Problème de porte",desc:"problème de porte",date: "2024-09-01",status: "en attente",sol: "--",},
    ];

const statusReclOptions = ["en attente","resolu","non resolu"];

export {columns, users, statusReclOptions};