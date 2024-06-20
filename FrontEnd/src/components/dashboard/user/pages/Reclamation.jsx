import React from "react";
import "./Statics.scss";
import { columns, users, statusReclOptions } from "./components/reclaData.jsx";
import ReclamationTable from "./components/reclaTab.jsx";
import ReclaGraph from "./components/reclaGraph";
import { Card, CardBody } from "@nextui-org/react";

const Reclamation = () => {
  const sampleData = [
    {
      label: "total des réclamations par mois",
      data: [20, 10, 10, 3, 6, 11],
      color: "#96A7FF",
    },
  ];

  return (
    <div className="w-full reclamation-Section">
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
        shadow="sm"
      >
        <CardBody>
          <ReclamationTable
            columns={columns}
            rows={users}
            statusReclOptions={statusReclOptions.map((option) => option.uid)}
            title="Historique des Réclamations"
          />
        </CardBody>
      </Card>
      <div className=" w-full reclGraph">
        <ReclaGraph title="Graphe linéaire des logements" data={sampleData} />
      </div>
    </div>
  );
};

export default Reclamation;
