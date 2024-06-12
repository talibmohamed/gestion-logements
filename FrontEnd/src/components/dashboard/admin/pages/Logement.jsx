import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LogTable from "./components/logTab.jsx";
import Graph from "./components/graph.jsx";
import "./Statics.scss";
import { Card, CardBody} from "@nextui-org/react";
import { columns, users } from "./components/logData.jsx";

const sampleData = [
  { label: "vacant", data: [12, 6, 20, 4, 20, 1], color: "#96A7FF" },
  { label: "non-vacant", data: [10, 2, 8, 16, 0, 4], color: "#f9769d" },
];

const Logement = () => {
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
            <LogTable columns={columns} rows={users} title="Logements" />
          </CardBody>
        </Card>

        <Graph title="Graphe linéaire des logements" data={sampleData} />
      </div>
    </div>
  );
};

export default Logement;
