const columns = [
    { name: "No", uid: "id", sortable: true },
    { name: "Id Résidant", uid: "id_res"},
    { name: "Nom du Résidant", uid: "nom" , sortable: true},
    { name: "Déscription", uid: "desc", sortable: true },
    { name: "Date de Réclamation", uid: "date"},
    { name: "Status", uid: "status", sortable: true },
    { name: "Date de Résolution", uid: "sol" },
    {name: "Actions", uid: "actions"}
];

const users = [
      {id: 1,id_res: "R001",nom: "Jean Dupont",desc: "Problème de chauffage",date: "2024-01-15",status: "attente",sol: "--",},
      {id: 2,id_res: "R002",nom: "Marie Curie",desc: "Fuite d'eau dans la salle de bain",date: "2024-02-10",status: "inachevé",sol: "2024-02-17",},
      {id: 3,id_res: "R003",nom: "Albert Einstein",desc: "Problème d'électricité",date: "2024-03-05",status: "résolu",sol: "2024-03-12",},
      {id: 4,id_res: "R004",nom: "Isaac Newton",desc: "Plomberie défectueuse",date: "2024-04-20",status: "attente",sol: "--",},
      {id: 5,id_res: "R005",nom: "Galileo Galilei",desc: "Problème de serrure",date: "2024-05-10",status: "résolu",sol: "2024-05-15",},
      {id: 6,id_res: "R006",nom: "Nikola Tesla",desc: "Panne de courant",date: "2024-06-01",status: "inachevé",sol: "2024-06-08",},
      {id: 7,id_res: "R007",nom: "Leonardo da Vinci",desc: "Problème de climatisation",date: "2024-06-20",status: "attente",sol: "--",},
      {id: 8,id_res: "R008",nom: "Ada Lovelace",desc: "Fuite de gaz",date: "2024-07-10",status: "résolu",sol: "2024-07-15",},
      {id: 9,id_res: "R009",nom: "Alan Turing",desc: "Problème de réseau",date: "2024-08-05",status: "inachevé",sol: "2024-08-12",},
      {id: 10,id_res: "R010",nom: "Charles Babbage",desc: "Problème de porte",date: "2024-09-01",status: "attente",sol: "--",},
    ];

const statusReclOptions = ["attente","resolu","inachevé"];

export {columns, users, statusReclOptions};