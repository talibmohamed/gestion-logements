import React, { useState, useEffect } from "react";
import "./Overview.scss";
import { columns, users, statusOptions } from "./components/facData";
import InvoiceTable from "./components/facTab.jsx";
import "./Overview.scss";
import { Card, CardBody, Textarea, Input } from "@nextui-org/react";

const Facture = () => {
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
            rows={users}
            statusOptions={statusOptions.map((option) => option.uid)}
            title="Factures "
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
            Envoyer un Avis de Facture en Retard
            <div className="flex gap-3">
              <Input
                variant="bordered"
                type="res_id"
                label="Id residant"
                labelPlacement="outside-left"
                size="sm"
                onClear={() => console.log("input cleared")}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">#</span>
                  </div>
                }
                className="custom-input max-w-xs"
              />
            </div>
          </h2>
          <div className="flex flex-col items-center justify-center">
            <Textarea
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your description"
              className="max-w-5xl "
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default Facture;
