import React,{useEffect} from "react";
import "./Statics.scss";
import { columns, statusReclOptions } from "./components/reclaData.jsx";
import ReclamationTable from "./components/reclaTab.jsx";
import ReclaGraph from "./components/reclaGraph";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody } from "@nextui-org/react";
import {
  fetchReclamationsThunk,
} from "../../../../session/thunks/adminthunk";

const Reclamation = () => {
  const dispatch = useDispatch();
  const reclamations = useSelector((state) => state.reclamation.reclamations);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchReclamationsThunk()).unwrap();
        console.log(response);
      } catch (error) {
        console.error("Error fetching reclamations:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  
  // Transform reclamations data to match the table's expected structure
  const transformedReclamations = reclamations.map((reclamation) => ({
    id: reclamation.rec_id,
    rec_id: reclamation.rec_id,
    nom: reclamation.nom,
    rec_type: reclamation.rec_type,
    rec_desc: reclamation.rec_desc,
    rec_date: reclamation.rec_date,
    rec_etat: reclamation.rec_etat,
    rec_response: reclamation.rec_response,
  }));
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
            rows={transformedReclamations}
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
