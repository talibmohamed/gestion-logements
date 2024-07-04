import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import LogSection from "./components/logSection.jsx";
import Graph from "./components/logGraph.jsx";
import "./Statics.scss";
import { Card, CardBody } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatisticsGraphThunk } from "../../../../session/thunks/userthunks";

const Logement = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const dispatch = useDispatch();
  const graphs = useSelector((state) => state.graph.graphs);

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

  useEffect(() => {
    dispatch(fetchStatisticsGraphThunk());
  }, [dispatch]);

  const eData = [
    {
      label: "Electricité (kWh)",
      data: graphs?.electricity || [],
      color: "#f9769d",
    },
  ];
  const wData = [
    { label: "Eau (m³)", data: graphs?.water || [], color: "#96A7FF" },
  ];
  const xLabels = graphs?.months || [];

  if (!graphs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="w-full">
        <Card
          isBlurred
          className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
          shadow="sm"
        >
          <CardBody className="mb-6">
            <LogSection title="Logements" />
          </CardBody>
        </Card>
        {isMobile ? (
          <Carousel showArrows={false} showStatus={false} showThumbs={false}>
            <div className="carousel-item-wrapper">
              <Graph
                title="Graphe de la consommation d'électricité"
                data={eData}
                xLabels={xLabels}
              />
            </div>
            <div className="carousel-item-wrapper">
              <Graph
                title="Graphe de consommation pour eau"
                data={wData}
                xLabels={xLabels}
              />
            </div>
          </Carousel>
        ) : isTablet ? (
          <div>
            <Graph
              title="Graphe linéaire de la consommation d'électricité"
              data={eData}
              xLabels={xLabels}
            />
            <Graph
              title="Graphe linéaire de la consommation d'eau"
              data={wData}
              xLabels={xLabels}
            />
          </div>
        ) : (
          <div className="flex flex-wrap justify-around">
            <div className="w-full md:w-1/2 pr-3">
              <Graph
                title="Graphe linéaire de la consommation d'électricité"
                data={eData}
                xLabels={xLabels}
              />
            </div>
            <div className="w-full md:w-1/2 pl-3">
              <Graph
                title="Graphe linéaire de la consommation d'eau"
                data={wData}
                xLabels={xLabels}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logement;
