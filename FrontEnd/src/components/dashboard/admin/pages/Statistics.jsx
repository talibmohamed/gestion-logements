import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LogTable from "./components/statsTab.jsx";
import PieChartCard from "./components/pie";
import Graph from "./components/graph";
import "./Statics.scss";
import { Card, CardBody, Textarea, Input } from "@nextui-org/react";

import { columns, users } from "./components/statsData";

// const data1 = [
//   { id: "total-payé", label: "Total Payé", value: 42, color: "#96A7FF" },
//   {
//     id: "total-en-retard",
//     label: "Total En Retard",
//     value: 20.1,
//     color: "#5F284A",
//   },
//   { id: "total-impayé", label: "Total Impayé", value: 38.5, color: "#282230" },
// ];

// const data2 = [
//   { id: "total-occupé", label: "Total Occupé", value: 80, color: "#F9769D" },
//   { id: "total-vacant", label: "Total Vacant", value: 20, color: "#282230" },
// ];

const sampleData = [
  { label: "vacant", data: [12, 6, 20, 4, 20, 1], color: "#96A7FF" },
  { label: "non-vacant", data: [10, 2, 8, 16, 0, 4], color: "#f9769d" },
];

const Statistics = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container mx-auto">
      <div className=" w-full ">
        <Card
          isBlurred
          className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
          shadow="sm"
        >
          <CardBody>
            <LogTable columns={columns} rows={users} title="Factures " />
          </CardBody>
        </Card>

        <Graph title="Graphe lineaire des logements" data={sampleData} />
      </div>
    </div>
  );
};

export default Statistics;
