import React, { useEffect } from "react";
import "./Overview.scss";
import { columns, users, statusOptions } from "./components/facData";
import FactureTable from "./components/facTab.jsx";
import { Card, CardBody } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFactureThunk,
  fetchResidantsThunk,
} from "../../../../session/thunks/adminthunk";
import { ToastContainer } from "react-toastify";
import Avis from "./components/avis.jsx";

const Facture = () => {
  const dispatch = useDispatch();
  const factures = useSelector((state) => state.facture.factures);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchFactureThunk()).unwrap();
        console.log(response);
      } catch (error) {
        console.error("Error fetching factures:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  //fetch all residants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchResidantsThunk()).unwrap();
      } catch (error) {
        console.error("Error fetching residants:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  // Transform factures data to match the table's expected structure
  const transformedFactures = factures.map((facture) => ({
    id: facture.fac_id,
    fac_id: facture.fac_id,
    id_res: facture.res_id,
    nom: facture.nom,
    fac_type: facture.fac_type,
    fac_date: facture.fac_date,
    fac_echeance: facture.fac_echeance,
    fac_etat: facture.fac_etat,
    fac_total: facture.fac_total,
  }));

  return (
    <div className="w-full">
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
        shadow="sm"
      >
        <CardBody>
          <FactureTable
            columns={columns}
            rows={users}
            statusOptions={statusOptions.map((option) => option.uid)}
            title="Factures"
          />
        </CardBody>
      </Card>
      <Avis />
      <ToastContainer />
    </div>
  );
};

export default Facture;
