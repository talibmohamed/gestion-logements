import React, { useEffect } from "react";
import "./Overview.scss";
import { columns, statusOptions } from "./components/facData";
import InvoiceTable from "./components/facTab.jsx";
import { Card, CardBody, Textarea, Input, Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchFactureThunk } from "../../../../session/thunks/userthunk";

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

  console.log(factures);

  // Transform factures data to match the table's expected structure
  const transformedFactures = factures.map((facture) => ({
    id: facture.fac_id,
    id_res: facture.res_id,
    nom: facture.nom,
    type: facture.fac_type,
    mois: facture.fac_date,
    echeance: facture.fac_echeance,
    status: facture.fac_etat,
    ttc: facture.fac_total,
  }));

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
