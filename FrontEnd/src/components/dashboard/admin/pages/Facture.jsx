import React, { useEffect } from "react";
import "./Overview.scss";
import { columns, statusOptions } from "./components/facData";
import InvoiceTable from "./components/facTab.jsx";
import { Card, CardBody, Textarea, Input, Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFactureThunk,
  fetchResidantsThunk,
} from "../../../../session/thunks/adminthunk";

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
        console.log(response);
      } catch (error) {
        console.error("Error fetching residants:", error);
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
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
        shadow="sm"
      >
        <CardBody>
          <h2 className="mx-2 mb-4 flex justify-between items-center">
            Envoyer un avis de facture en retard
            <div className="flex gap-3">
              <Button color="danger" variant="flat">
                Envoyer !
              </Button>
            </div>
          </h2>
          <div className="reclMsg">
            <Input
              variant="bordered"
              type="res_id"
              label="Id résidant"
              labelPlacement="outside-left"
              size="sm"
              onClear={() => console.log("input cleared")}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">#</span>
                </div>
              }
              className="custom-input max-w-xs mb-2 ml-2 "
              classNames={{
                label: "text-sm font-normal",
              }}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Textarea
              variant="bordered"
              labelPlacement="outside"
              placeholder="Entrer votre description"
              className="max-w-5xl mb-4"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Facture;
