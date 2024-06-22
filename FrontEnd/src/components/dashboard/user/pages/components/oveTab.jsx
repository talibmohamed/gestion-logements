import React, { useEffect, useState } from "react";
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "../Icons/EyeIcon";
import { VerticalDotsIcon } from "../Icons/VerticalDotsIcon";
import ReadMoreIcon from '@mui/icons-material/ReadMore';

const statusColorMap = {
  "en retard": "primary",
  "en attente": "warning",
  payée: "secondary",
};

const INITIAL_VISIBLE_COLUMNS = [
  "id_fac",
  "type",
  "mois",
  "echeance",
  "status",
  "ttc",
];

const SMALL_DEVICE_COLUMNS = ["id_fac", "type","echeance", "status", "actions"];

const DataTable = ({ columns, rows, title }) => {
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [currentOverview, setCurrentOverview] = useState(null);
  const {
    isOpen: isDetailsModalOpen,
    onOpen: openDetailsModal,
    onOpenChange: setDetailsModalOpen,
  } = useDisclosure();

  const navigate = useNavigate();

  const headerColumns = columns.filter((column) =>
    visibleColumns.has(column.uid)
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
      setVisibleColumns(
        window.innerWidth <= 900
          ? new Set(SMALL_DEVICE_COLUMNS)
          : new Set(INITIAL_VISIBLE_COLUMNS)
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDotsIconClick = (overview) => {
    setCurrentOverview(overview);
  };

  const handleDetailsIconClick = (overview) => {
    setCurrentOverview(overview);
    openDetailsModal(true);
  };

  const renderCell = (item, column) => {
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
      case "actions":
        return (
          <Dropdown
            classNames={{
              content: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
            }}
          >
            <DropdownTrigger>
              <span className="icon-wrapper" onClick={handleDotsIconClick}>
                <VerticalDotsIcon />
              </span>
            </DropdownTrigger>
            <DropdownMenu
                    aria-label="Action event example"
                    onAction={(key) => {
                      if (key === "details") handleDetailsIconClick(item);
                      if (key === "voirPlus") navigate("/dashboard/facture");
                    }}
                  >
                    <DropdownItem key="details" startContent={<EyeIcon />}>
                      Détails
                    </DropdownItem>
                    <DropdownItem
                      key="voirPlus"
                      color="danger"
                      startContent={<ReadMoreIcon sx={{ fontSize: 17 }}/>}
                    >
                      Voir plus
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
        );
      default:
        return <p className="text-bold text-sm capitalize">{cellValue}</p>;
    }
  };

  return (
    <div className="w-full">
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
        shadow="sm"
      >
        <CardBody>
          <div className="card-header">
            {title && <h2 className="mb-4 table-title">{title}</h2>}
          </div>
          <Table
            aria-label="Example table with custom cells"
            removeWrapper={true}
            className={{ base: "overflow-auto", wrapper: "max-h-[382px]" }}
          >
            <TableHeader columns={headerColumns}>
              {headerColumns.map((column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody items={rows} emptyContent={"No data found"}>
              {(item) => (
                <TableRow key={item.id}>
                  {headerColumns.map((column) => (
                    <TableCell key={column.uid}>
                      {renderCell(item, column)}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Modal
            size="lg"
            isOpen={isDetailsModalOpen}
            onOpenChange={() => setDetailsModalOpen(false)}
            className="recDesc"
            classNames={{
              base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
              closeButton: "hover:bg-white/5 active:bg-white/10",
            }}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Détails de la réclamation
                  </ModalHeader>
                  <ModalBody>
                    {isMobile && (
                      <>
                        <Input
                          isReadOnly
                          label="Type de Facture"
                          variant="bordered"
                          labelPlacement="outside"
                          defaultValue={currentOverview.type}
                          className="mb-3"
                        />
                        <Input
                          isReadOnly
                          label="Mois de Consommation"
                          variant="bordered"
                          labelPlacement="outside"
                          defaultValue={currentOverview.mois}
                          className="mb-3"
                        />
                        <Input
                          isReadOnly
                          label="Echeance"
                          variant="bordered"
                          labelPlacement="outside"
                          defaultValue={currentOverview.echeance}
                          className="mb-3"
                        />
                        <Input
                          isReadOnly
                          label="Status"
                          variant="bordered"
                          labelPlacement="outside"
                          defaultValue={currentOverview.status}
                          className="mb-3"
                        />
                        <Input
                          isReadOnly
                          label="Montant TTC"
                          variant="bordered"
                          labelPlacement="outside"
                          defaultValue={currentOverview.ttc}
                          className="mb-3"
                        />
                      </>
                    )}
                    
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onClick={onClose}>
                      Fermer
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </CardBody>
      </Card>
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
