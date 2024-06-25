import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogementsThunk } from '../../../../session/thunks/adminthunk.jsx';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LogTable from "./components/logTab.jsx";
import Graph from "./components/graph.jsx";
import "./Statics.scss";
import { Card, CardBody } from "@nextui-org/react";
import { columns } from "./components/logData.jsx";

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

  const dispatch = useDispatch();
  const logements = useSelector(state => state.logements.logements);

  useEffect(() => {
    dispatch(fetchLogementsThunk()); 
  }, [dispatch]); 

  const transformLogementsData = (logements) => {
    return logements.map((logement) => ({
      id: logement.log_id,
      num_de_log: logement.log_id,
      nom: logement.nom,
      type_log: logement.typelog,
      ameliored: logement.is_ameliore ? 'Oui' : 'Non',
      mc: `${logement.piece} pièces (${logement.mc}m²)`,
      address: logement.address,
      quotaE: logement.quotas_electricite.toString(),
      quotaW: logement.quotas_eau.toString(),
      equipment_names: logement.equipment_names,
    }));
  };
  
  const transformedLogements = transformLogementsData(logements); 

  return (
    <div className="container mx-auto">
      <div className="w-full">
        <Card
          isBlurred
          className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
          shadow="sm"
        >
          <CardBody>
            <LogTable columns={columns} rows={transformedLogements} title="Logements" />
          </CardBody>
        </Card>

        <Graph title="Graphe linéaire des logements" data={sampleData} />
      </div>
    </div>
  );
};

export default Logement;
