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

export { columns };
