const columns = [
  { name: "No", uid: "id" },
  { name: "No logement", uid: "num_de_log" },
  { name: "Occupé Par", uid: "nom", sortable: true },
  { name: "Dédié au", uid: "type_log", sortable: true },
  { name: "Amelioré", uid: "ameliored", sortable: true },
  { name: "Address", uid: "address", sortable: true },
  { name: "Pièces ( Superficie m² )", uid: "mc" },
  { name: "Electricité (kWh / mois) ", uid: "quotaE" },
  { name: "Eau (m³ / mois)", uid: "quotaW" },
  { name: "Statut", uid: "statut", sortable: true },
  { name: "Equipements", uid: "equip" },
  { name: "Actions", uid: "actions" },
];

const mockData = [
  {
    id: 1,
    num_de_log: "A123",
    nom: "John Doe",
    type_log: "Famille",
    ameliored: true,
    address: "123 Rue de la Paix, Paris",
    mc: "4 (120 m²)",
    quotaE: "350 kWh",
    quotaW: "15 m³",
    status: "en maintenance",
    equip: "Meublé",
    actions: "Modifier / Supprimer",
  },]


  const statusLogOptions = ["disponible", "en maintenance", "occupé"];
export { columns, mockData, statusLogOptions };
