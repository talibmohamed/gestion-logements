import React, { useEffect } from "react";
import "./Overview.scss";
import { columns, statusOptions } from "./components/facData";
import InvoiceTable from "./components/facTab.jsx";
import { Card, CardBody } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFactureThunk } from "../../../../session/thunks/userthunks.jsx";

const Facture = () => {
  const dispatch = useDispatch();
  const factures = useSelector((state) => state.facture.factures); // Ensure the state key is correct

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchFactureThunk()).unwrap();
        console.log("API Response:", response);
      } catch (error) {
        console.error("Error fetching factures:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  console.log(factures);

  // Ensure factures is always an array
  const transformedFactures = factures.map((facture) => ({
    id: facture.fac_id,
    id_fac: facture.fac_id,
    nom: facture.nom,
    type: facture.fac_type,
    mois: facture.fac_date,
    echeance: facture.fac_echeance,
    status: facture.fac_etat,
    ttc: facture.fac_total,
  }));

  console.log("Transformed Factures:", transformedFactures);

  return (
    <div className="w-full">
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
        shadow="sm"
      >
        <CardBody>
          <InvoiceTable
            columns={columns}
            rows={transformedFactures}
            statusOptions={statusOptions.map((option) => option.uid)}
            title="Factures"
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Facture;
