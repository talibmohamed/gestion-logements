import React from "react";
import PropTypes from "prop-types";
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
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const DataTable = ({ columns, rows, title }) => {
  const statusColorMap = {
    Pending: "warning",
    Paid: "primary",
    Overdue: "primary",
  };

  const getKeyValue = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "etat":
        return (
          <Chip className={statusColorMap[item.etat]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="table">
      <div className="card-wrapper">
        <Card
          isBlurred
          className="border-none bg-background/15 white:bg-default-100/50 card"
          shadow="sm"
        >
          <CardBody>
            <div className="card-header">
              {title && <h2 className="table-title">{title}</h2>}
              <div className="card-actions">
                <Dropdown backdrop="opaque">
                  <DropdownTrigger>
                    <Button isIconOnly radius="full" size="sm" variant="light">
                      <MoreHorizIcon className="text-default-600 border-none" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu variant="faded" aria-label="Static Actions">
                    <DropdownItem key="Edit" href="/dashboard/facture" classname="text-edit" color="default">Modifier</DropdownItem>
                    <DropdownItem key="fermer" href="#" className="text-danger" color="danger">Fermer</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <Table aria-label="Example table with dynamic content">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={rows}>
                {(item) => (
                  <TableRow key={item.key}>
                    {(columnKey) => (
                      <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string, // Add the title prop type
};

export default DataTable;
