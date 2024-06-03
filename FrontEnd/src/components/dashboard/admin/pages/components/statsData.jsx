const columns =[
    { name: "No", uid: "id"},
    {name: "No logement", uid:"num_de_log"},
    { name: "Occupe Par", uid: "nom"},
    { name: "Profession", uid: "prof", sortable: true },
    { name: "Type de Logement", uid: "type_log", sortable: true },
    { name: "Equipements", uid: "equip" },
    {name: "actions", uid: "actions"}
]

const users = [
    {
      id: 1,
      num_de_log: "LOG001",
      nom: "John Doe",
      prof: "Software Engineer",
      type_log: "Ameliore",
    },
    {
      id: 2,
    num_de_log: "LOG001",
      nom: "Jane Smith",
      prof: "Data Scientist",
      type_log: "Non ameliore",
    },
    {
      id: 3,
      num_de_log: "LOG001",
      nom: "Alice Johnson",
      prof: "Web Developer",
      type_log: "Ameliore",
    },
    {
      id: 4,
      num_de_log: "LOG001",
      nom: "Michael Brown",
      prof: "UX Designer",
      type_log: "Ameliore",
    },
    {
      id: 5,
      num_de_log: "LOG001",
      nom: "Emily Wilson",
      prof: "Project Manager",
      type_log: "Non Ameliore",
    },
    {
      id: 6,
      num_de_log: "LOG001",
      nom: "David Jones",
      prof: "Business Analyst",
      type_log: "Non Ameliore",
    },
    {
      id: 7,
      num_de_log: "LOG001",
      nom: "Jessica Lee",
      prof: "Marketing Specialist",
      type_log: "Non Ameliore",
    },
    {
      id: 8,
      num_de_log: "LOG001",
      nom: "Daniel Martinez",
      prof: "Financial Analyst",
      type_log: "Non Ameliore",
    },
    {
      id: 9,
      num_de_log: "LOG001",
      nom: "Sophia Taylor",
      prof: "Graphic Designer",
      type_log: "Ameliore",
    },
    {
      id: 10,
      num_de_log: "LOG001",
      nom: "William Miller",
      prof: "Software Developer",
      type_log: "Studio",
    },
  ];
  
  
export {columns, users};