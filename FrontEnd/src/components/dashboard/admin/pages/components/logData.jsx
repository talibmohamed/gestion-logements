const columns = [
  { name: "No", uid: "id" },
  { name: "No logement", uid: "num_de_log" },
  { name: "Occupé Par", uid: "nom", sortable: true },
  { name: "Profession/Type de Logement", uid: "type_log", sortable: true },
  { name: "Amelioré", uid: "ameliored", sortable: true},
  { name: "Equipements", uid: "equip" },
  { name: "Actions", uid: "actions" },
];

const users = [
  {
    id: 1,
    num_de_log: "LOG001",
    nom: "John Doe",
    type_log: "Cadre",
    ameliored: "Oui",
  },
  {
    id: 2,
    num_de_log: "LOG002",
    nom: "Jane Smith",
    type_log: "Cadre",
    ameliored: "Non",
  },
  {
    id: 3,
    num_de_log: "LOG003",
    nom: "Alice Johnson",
    type_log: "Ouvrier ",
    ameliored: "Oui",
  },
  {
    id: 4,
    num_de_log: "LOG004",
    nom: "Michael Brown",
    type_log: "Ouvrier",
    ameliored: "Oui",
  },
  {
    id: 5,
    num_de_log: "LOG005",
    nom: "Emily Wilson",
    type_log: "Ouvrier  ",
    ameliored: "Non",
  },
  {
    id: 6,
    num_de_log: "LOG006",
    nom: "",
    type_log: "Cadre ",
    ameliored: "Oui",
  },
  {
    id: 7,
    num_de_log: "LOG007",
    nom: "",
    type_log: "Ouvrier  ",
    ameliored: "Non",
  },
  {
    id: 8,
    num_de_log: "LOG008",
    nom: "Daniel Martinez",
    type_log: "Ouvrier ",
    ameliored: "Non",
  },
  {
    id: 9,
    num_de_log: "LOG009",
    nom: "Sophia Taylor",
    type_log: "Cadre ",
    ameliored: "Oui",
  },
  {
    id: 10,
    num_de_log: "LOG0010",
    nom: "William Miller",
    type_log: "Ouvrier ",
    ameliored: "Non",
  },
];

export { columns, users };
