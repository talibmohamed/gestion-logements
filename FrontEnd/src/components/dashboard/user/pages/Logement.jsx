import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import LogTable from "./components/logTab.jsx";
import Graph from "./components/logGraph.jsx";
import "./Statics.scss";
import { Card, CardBody } from "@nextui-org/react";

const eData = [
  {
    label: "Electricité (kWh)",
    data: [500, 480, 520, 510, 490, 500],
    color: "#f9769d",
  },
];
const wData = [
  { label: "Eau (m³)", data: [20, 19, 21, 20, 20, 19], color: "#96A7FF" },
];

const Logement = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 900);
      setIsTablet(width > 900 && width <= 1366);
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
            <LogTable title="Logements" />
          </CardBody>
        </Card>
        {isMobile ? (
          <Carousel showArrows={false} showStatus={false} showThumbs={false}>
            <div className="carousel-item-wrapper">
              <Graph
                title="Graphe de consommation pour electricite"
                data={eData}
              />
            </div>
            <div className="carousel-item-wrapper">
              <Graph title="Graphe de consommation pour eau" data={wData} />
            </div>
          </Carousel>
        ) : isTablet ? (
          <div>
            <Graph
              title="Graphe linéaire de consommation d'electricite"
              data={eData}
            />
            <Graph
              title="Graphe linéaire de consommation pour eau"
              data={wData}
            />
          </div>
        ) : (
          <div className="flex flex-wrap justify-around">
            <div className="w-full md:w-1/2 pr-3">
              <Graph
                title="Graphe linéaire de consommation d'electricite"
                data={eData}
              />
            </div>
            <div className="w-full md:w-1/2 pl-3">
              <Graph
                title="Graphe linéaire de consommation pour eau"
                data={wData}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logement;
