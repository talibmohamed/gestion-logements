const columns = [
    { name: "No", uid: "id", sortable: true },
    { name: "Id Réclamation", uid: "rec_id"},
    { name: "Nom du Résidant", uid: "nom" , sortable: true},
    { name: "Type de Réclamation", uid: "rec_type", sortable: true },
    { name: "rec_description", uid: "rec_desc"},
    { name: "Date de Réclamation", uid: "rec_date"},
    { name: "Status", uid: "rec_etat", sortable: true },
    { name: "Date de Résolution", uid: "rec_response" },
    {name: "Actions", uid: "actions"}
];

const statusReclOptions = ["annulee", "en attente","resolue","non resolue"];

export {columns, statusReclOptions};