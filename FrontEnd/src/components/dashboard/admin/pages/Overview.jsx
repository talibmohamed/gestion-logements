import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PieChartCard from "./components/pie"; 
import DataTable from "./components/table"; 
import './Overview.scss';
import { columns, users } from "./components/data";
import React, { useState, useEffect } from "react";


const statusColorMap = {
  overdue: "primary",
  pending: "warning",
  paid: "secondary",
};

const data1 = [
  { id: "total-payé", label: "Total Payé", value: 42, color: "#96A7FF" },
  { id: "total-en-retard", label: "Total En Retard", value: 20.1, color: "#5F284A" },
  { id: "total-impayé", label: "Total Impayé", value: 38.5, color: "#282230" },
];
const data2 = [
  { id: "total-occupé", label: "Total Occupé", value: 80, color: "#F9769D" },
  { id: "total-vacant", label: "Total Vacant", value: 20, color: "#282230" },
];


const Overview = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      {isMobile ? (
        <Carousel showArrows={false} showStatus={false} showThumbs={false}>
          <div className="carousel-item-wrapper">
            <PieChartCard title="Statistique Des Factures" data={data1} />
          </div>
          <div className="carousel-item-wrapper">
            <PieChartCard title="Statistique Des Logements" data={data2} />
          </div>
        </Carousel>
      ) : (
        <div className="flex flex-wrap justify-around">
          <div className="w-full md:w-1/2 p-2">
            <PieChartCard title="Statistique Des Factures" data={data1} />
          </div>
          <div className="w-full md:w-1/2 p-2">
            <PieChartCard title="Statistique Des Logements" data={data2} />
          </div>
        </div>
      )}
      <DataTable columns={columns} rows={users} title="Factures récentes" />
    </div>
  );
}

export default Overview;
