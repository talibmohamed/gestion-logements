const columns = [
  { name: "No", uid: "id" },
  { name: "No logement", uid: "num_de_log" },
  { name: "Profession/Type de Logement", uid: "type_log", sortable: true },
  { name: "Amelioré", uid: "ameliored", sortable: true},
  { name: "Pièces ( Superficie m² )", uid: "mc"},
  { name: "Quotas d'électricité (kWh / mois) ", uid: "quotaE"},
  { name: "Quotas d'eau (m³ / mois)", uid: "quotaW"},
  { name: "Equipements", uid: "equip" },
];

const users = [
  {
    id: 1,
    num_de_log: "LOG001",
    type_log: "Cadre",
    ameliored: "Oui",
    mc: "5 pièces (120m²)",
    quotaE:"500",
    quotaW:"20",
  },
];

export { columns, users };
