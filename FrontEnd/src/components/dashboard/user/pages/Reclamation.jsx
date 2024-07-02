import React, { useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReclamationThunk } from "../../../../session/thunks/userthunks.jsx";
import ReclaCard from "./components/reclaCard";
import ReclamationTable from "./components/reclaTab.jsx";
import { columns, statusReclOptions } from "./components/reclaData.jsx";
import { ToastContainer } from "react-toastify";

const Reclamation = () => {
  const dispatch = useDispatch();
  const reclamations = useSelector((state) => state.reclamation.reclamations)
    ? useSelector((state) => state.reclamation.reclamations)
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchReclamationThunk()).unwrap();
        console.log(response);
      } catch (error) {
        console.error("Error fetching factures:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  // console.log(reclamations);
  // Ensure reclamations is always an array and handle empty case
  const transformedReclamations = reclamations
    ? reclamations.map((reclamation) => ({
        id: reclamation.rec_id,
        id_recl: reclamation.rec_id,
        type_recl: reclamation.rec_type,
        desc: reclamation.rec_description,
        date: reclamation.rec_date,
        status: reclamation.rec_etat,
        sol: reclamation.rec_response,
      }))
    : [];

  return (
    <div>
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
        shadow="sm"
      >
        <CardBody>
          <ReclaCard title="Réclamations" />
        </CardBody>
        <CardBody>
          <ReclamationTable
            columns={columns}
            rows={transformedReclamations}
            statusReclOptions={statusReclOptions.map((option) => option.uid)}
            title="Historique des Réclamations"
          />
        </CardBody>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default Reclamation;
