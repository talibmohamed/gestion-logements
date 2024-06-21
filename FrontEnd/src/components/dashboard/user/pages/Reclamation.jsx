import React from "react";
import "./Statics.scss";
import { columns, users, statusReclOptions } from "./components/reclaData.jsx";
import ReclamationTable from "./components/reclaTab.jsx";
import ReclaGraph from "./components/reclaGraph";
import ReclaCard from "./components/reclaCard";
import { Card, CardBody } from "@nextui-org/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Reclamation = () => {
  const sampleData = [
    {
      label: "total des réclamations par mois",
      data: [20, 10, 10, 3, 6, 11],
      color: "#96A7FF",
    },
  ];

  return (
  <div>
      <div>
        <Card
          isBlurred
          className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
          shadow="sm"
        >
          <CardBody>
            <ReclaCard title="Reclamation" />
          </CardBody>
          <CardBody>
            <ReclamationTable
              columns={columns}
              rows={users}
              statusReclOptions={statusReclOptions.map((option) => option.uid)}
              title="Historique des Réclamations"
            />
          </CardBody>
        </Card>
      </div></div>
  );
};

export default Reclamation;
