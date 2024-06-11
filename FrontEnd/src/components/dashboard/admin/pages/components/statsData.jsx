const columns =[
    { name: "No", uid: "id"},
    {name: "No logement", uid:"num_de_log"},
    { name: "Occupe Par", uid: "nom", sortable: true},
    { name: "Profession/Type de Logement", uid: "type_log", sortable: true },
    { name: "Equipements", uid: "equip" },
    {name: "actions", uid: "actions"}
]

const users = [
    {
      id: 1,
      num_de_log: "LOG001",
      nom: "John Doe",
      type_log: " Cadre ameliore",
    },
    {
      id: 2,
      num_de_log: "LOG002",
      nom: "Jane Smith",
      type_log: "Cadre non ameliore",
    },
    {
      id: 3,
      num_de_log: "LOG003",
      nom: "Alice Johnson",
      type_log: "Ouvrier ameliore",
    },
    {
      id: 4,
      num_de_log: "LOG004",
      nom: "Michael Brown",
      type_log: "Ouvrier ameliore",
    },
    {
      id: 5,
      num_de_log: "LOG005",
      nom: "Emily Wilson",
      type_log: "Ouvrier non ameliore",
    },
    {
      id: 6,
      num_de_log: "LOG006",
      nom: "",
      type_log: "Cadre ameliore",
    },
    {
      id: 7,
      num_de_log: "LOG007",
      nom: "",
      type_log: "Ouvrier non ameliore",
    },
    {
      id: 8,
      num_de_log: "LOG008",
      nom: "Daniel Martinez",
      type_log: " Ouvrier non ameliore",
    },
    {
      id: 9,
      num_de_log: "LOG009",
      nom: "Sophia Taylor",
      type_log: "Cadre ameliore",
    },
    {
      id: 10,
      num_de_log: "LOG0010",
      nom: "William Miller",
      type_log: "Ouvrier non ameliore",
    },
  ];
  
  
export {columns, users};