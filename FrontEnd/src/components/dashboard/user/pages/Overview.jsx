import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { PieChart } from '@mui/x-charts/PieChart';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import "./Overview.scss";

const Overview = () => {
  const data1 = [
    { label: 'total payé', value: 42, color: '#96A7FF' },
    { label: 'total en retard', value: 20.1, color: '#5F284A' },
    { label: 'total impayé', value: 38.5, color: 'transparent' },
  ];
  const data2 = [
    { label: 'Total Occupé', value: 80, color: '#F9769D' },
    { label: 'Total Vacant', value: 20, color: 'transparent' },
  ];

  const rows = [
    {
      key: "1",
      No: "1",
      id: "#1313313",
      nom:"Dmitry Lauretsky",
      Type: "Eau",
      Mois: "01/2024",
      echeance: "22/02/2024",
      etat:"pending",
      ttc: "$10",
    },
    {
      key: "2",
      No: "2",
      id: "#1313313",
      nom:"Dmitry Lauretsky",
      Type: "Eau",
      Mois: "01/2024",
      echeance: "22/02/2024",
      etat:"pending",
      ttc: "$10",
    },
    {
      key: "3",
      No: "3",
      id: "#1313313",
      nom:"Dmitry Lauretsky",
      Type: "Eau",
      Mois: "01/2024",
      echeance: "22/02/2024",
      etat:"pending",
      ttc: "$10",
    },
    {
      key: "4",
      No: "4",
      id: "#1313313",
      nom:"Dmitry Lauretsky",
      Type: "Eau",
      Mois: "01/2024",
      echeance: "22/02/2024",
      etat:"pending",
      ttc: "$10",
    },
    {
      key: "5",
      No: "5",
      id: "#1313313",
      nom:"Dmitry Lauretsky",
      Type: "Eau",
      Mois: "01/2024",
      echeance: "22/02/2024",
      etat:"pending",
      ttc: "$10",
    },
    {
      key: "6",
      No: "6",
      id: "#1313313",
      nom:"Dmitry Lauretsky",
      Type: "Eau",
      Mois: "01/2024",
      echeance: "22/02/2024",
      etat:"pending",
      ttc: "$10",
    },
  ];

  const columns = [
    {
      key: "No",
      label: "No",
    },
    {
      key: "id",
      label: "Id Residant",
    },
    {
      key: "nom",
      label: "Nom du Residant",
    },
    {
      key: "Type",
      label: "Type de facture",
    },
    {
      key: "Mois",
      label: "Mois Consommation",
    },
    {
      key: "echeance",
      label: "Echéance",
    },
    {
      key: "etat",
      label: "Etat",
    },
    {
      key: "ttc",
      label: "Montant TTC",
    },
  ];

  return (
    <div className="overview-container">
      {/* 1st pie chart */}
      <div className="card-wrapper stats-water">
        <Card
          isBlurred
          className="border-none bg-background/15 white:bg-default-100/50 max-w-[450px]"
          shadow="sm"
        >
          <CardBody>
            <h2 className="text-left">Statistique Des Factures</h2>
            <PieChart
              series={[
                {
                  data: data1,
                  cx: '50%',
                  cy: '50%',
                  innerRadius: 40,
                  outerRadius: 80,
                },
              ]}
              height={250}
              width={390}
              slotProps={{
                legend: { hidden: true },
              }}
            />
            <div className="custom-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#96A7FF' }}></div>
                <div className="legend-label">total payé</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#5F284A' }}></div>
                <div className="legend-label">total en retard</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#21222d' }}></div>
                <div className="legend-label">total impayé</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      {/* 2nd pie chart */}
      <div className="card-wrapper stats-electricity">
        <Card
          isBlurred
          className="border-none bg-background/15 white:bg-default-100/50 max-w-[450px]"
          shadow="sm"
        >
          <CardBody>
            <h2 className="text-left">Statistique Des Logements</h2>
            <PieChart
              series={[
                {
                  data: data2,
                  cx: '50%',
                  cy: '50%',
                  innerRadius: 40,
                  outerRadius: 80,
                },
              ]}
              height={250}
              width={390}
              slotProps={{
                legend: { hidden: true },
              }}
            />
            <div className="custom-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#F9769D' }}></div>
                <div className="legend-label">Total Occupé</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#21222d' }}></div>
                <div className="legend-label">Total Vacant</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="table">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </div>
      );
};

      export default Overview;
