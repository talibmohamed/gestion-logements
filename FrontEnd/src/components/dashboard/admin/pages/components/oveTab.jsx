import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Card,
  CardBody,
  Button,
  Link,
} from "@nextui-org/react";
import PropTypes from "prop-types";

const statusColorMap = {
  retard: "primary",
  attente: "warning",
  payé: "secondary",
};

const DataTable = ({ columns, rows, title }) => {
  const renderCell = React.useCallback((item, column) => {
    const cellValue = item[column.uid];
    switch (column.uid) {
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[item.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      default:
        return <p className="text-bold text-sm capitalize">{cellValue}</p>;
    }
  }, []);

  const isAbove900 = window.innerWidth > 900;

  return (
    <div className="w-full">
      {isAbove900 ? (
        <Card
          isBlurred
          className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
          shadow="sm"
        >
          <CardBody>
            <div className="card-header">
              {title && <h2 className="mb-4 table-title">{title}</h2>}
              <Button
                href="/dashboard/facture"
                as={Link}
                variant="light"
                color="primary"
                size="md"
                className="mb-4 mr-1 cMore"
              >
                See more
              </Button>
            </div>
            <Table 
              aria-label="Example table with custom cells"
              removeWrapper={true}
              className={{ base: "overflow-auto", wrapper: "max-h-[382px]" }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.uid} align={"center"}>
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={rows}>
                {(item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell key={column.uid}>
                        {renderCell(item, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      ) : (
        <div className="below-900-content">
          {/* Placeholder for the component to be rendered below 900px */}
          <Card>
            {" "}
            <CardBody>
              <h2 className="table-title">{title}</h2>
              {rows.map((item, rowIndex) => (
                <div key={rowIndex} className="below-900-card-row">
                  <Card
                    isBlurred
                    className="border-none white:bg-default-100/50 p-3 my-3 w-full over"
                    shadow="sm"
                  >
                    <table
                      className="w-full"
                      aria-label="Example static collection table"
                    >
                      <tbody>
                        {columns.map((column) => (
                          <tr key={column.uid}>
                            <td>{column.name}</td>
                            <td>{renderCell(item, column)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      id_res: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      mois: PropTypes.string.isRequired,
      echeance: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      ttc: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
};

export default DataTable;
