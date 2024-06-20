import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PieChartCard from "./components/ovePie";
import DataTable from "./components/oveTab";
import "./Overview.scss";
import { columns, users } from "./components/oveData";

const data1 = [
  { id: "consomme", label: "Consommé", value: 65, color: "#96A7FF" },
  { id: "reste", label: "Reste", value: 35, color: "#282230" },
];

const data2 = [
  { id: "consomme", label: "Consommé", value: 80, color: "#F9769D" },
  { id: "reste", label: "Reste", value: 20, color: "#282230" },
];

const Overview = () => {
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
      {isMobile ? (
        <Carousel showArrows={false} showStatus={false} showThumbs={false}>
          <div className="carousel-item-wrapper">
            <PieChartCard title="Statistique Consommation Eau" data={data1} />
          </div>
          <div className="carousel-item-wrapper">
            <PieChartCard title="Statistique Consommation Electricité" data={data2} />
          </div>
        </Carousel>
      ) : (
        <div className="flex flex-wrap justify-around">
          <div className="w-full md:w-1/2 p-2">
            <PieChartCard title="Statistique Consommation Eau" data={data1} />
          </div>
          <div className="w-full md:w-1/2 p-2">
            <PieChartCard title="Statistique Consommation Electricité" data={data2} />
          </div>
        </div>
      )}
      <div className="w-full">
        <DataTable columns={columns} rows={users} title="Factures récentes" />
      </div>
    </div>
  );
};

export default Overview;
