import React, { useState, useEffect } from "react";
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
  Select,
  SelectItem,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "../Icons/EyeIcon";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { VerticalDotsIcon } from "../Icons/VerticalDotsIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { EditIcon } from "../Icons/EditIcon";

const statusColorMap = {
  "En Retard": "primary",
  "En Attente": "warning",
  Payée: "secondary",
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "nom",
  "type",
  "mois",
  "echeance",
  "status",
  "ttc",
];

const SMALL_DEVICE_COLUMNS = [
  "id_res",
  "nom",
  "type",
  "echeance",
  "status",
  "actions",
];

const DataTable = ({ columns, rows, title }) => {
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [currentOverview, setCurrentOverview] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const {
    isOpen: isDetailsModalOpen,
    onOpen: openDetailsModal,
    onOpenChange: setDetailsModalOpen,
  } = useDisclosure();

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

  const headerColumns = columns.filter((column) =>
    visibleColumns.has(column.uid)
  );

  const handleDotsIconClick = (item) => {
    setCurrentOverview(item);
  };
  const handleDetailsIconClick = (item) => {
    setCurrentOverview(item);
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
              <span className="icon-wrapper">
                <VerticalDotsIcon onClick={() => handleDotsIconClick(item)} />
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
                startContent={<ReadMoreIcon sx={{ fontSize: 17 }} />}
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
             <Button
                variant="light"
                color="primary"
                size="md"
                className="mb-4 mr-1 cMore"
                onClick={() => navigate('/dashboard/facture')}
              >
                Voir plus
              </Button>
          </div>
          <Table
            aria-label="Example table with custom cells"
            removeWrapper={true}
            className={{ base: "overflow-auto", wrapper: "max-h-[382px]" }}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn key={column.uid} align="center">
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={rows}>
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
        </CardBody>
      </Card>

      <Modal
        size="lg"
        isOpen={isDetailsModalOpen}
        onOpenChange={() => setDetailsModalOpen(false)}
        classNames={{
          base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Détails de la Facture
              </ModalHeader>
              <ModalBody>
                <Input
                  isReadOnly
                  type="text"
                  label="Résidant:"
                  variant="bordered"
                  defaultValue={currentOverview.nom}
                  className="max-w-sm"
                  classNames={{
                    label: "group-data-[filled-within=true]:text-zinc-400",
                    input: [
                      "bg-transparent",
                      "group-data-[has-value=true]:text-white/90",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                      "bg-transparent",
                      "group-data-[hover=true]:bg-zinc-800",
                      "group-data-[hover=true]:border-zinc-500",
                      "group-data-[focus=true]:bg-transparent ",
                      "group-data-[focus=true]:border-zinc-400 ",
                      "!cursor-text",
                      "border-zinc-600",
                    ],
                  }}
                />

                <Input
                  isReadOnly
                  type="text"
                  label="Type de Facture:"
                  variant="bordered"
                  defaultValue={currentOverview.type}
                  className="max-w-sm"
                  classNames={{
                    label: "group-data-[filled-within=true]:text-zinc-400",
                    input: [
                      "bg-transparent",
                      "group-data-[has-value=true]:text-white/90",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                      "bg-transparent",
                      "group-data-[hover=true]:bg-zinc-800",
                      "group-data-[hover=true]:border-zinc-500",
                      "group-data-[focus=true]:bg-transparent ",
                      "group-data-[focus=true]:border-zinc-400 ",
                      "!cursor-text",
                      "border-zinc-600",
                    ],
                  }}
                />

                <Input
                  isReadOnly
                  label="Mois de Consommation"
                  variant="bordered"
                  defaultValue={currentOverview.mois}
                  className="max-w-sm"
                  classNames={{
                    label: "group-data-[filled-within=true]:text-zinc-400",
                    input: [
                      "bg-transparent",
                      "group-data-[has-value=true]:text-white/90",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                      "bg-transparent",
                      "group-data-[hover=true]:bg-zinc-800",
                      "group-data-[hover=true]:border-zinc-500",
                      "group-data-[focus=true]:bg-transparent ",
                      "group-data-[focus=true]:border-zinc-400 ",
                      "!cursor-text",
                      "border-zinc-600",
                    ],
                  }}
                />
                <Input
                  isReadOnly
                  label="Echeance"
                  variant="bordered"
                  defaultValue={currentOverview.echeance}
                  className="max-w-sm"
                  classNames={{
                    label: "group-data-[filled-within=true]:text-zinc-400",
                    input: [
                      "bg-transparent",
                      "group-data-[has-value=true]:text-white/90",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                      "bg-transparent",
                      "group-data-[hover=true]:bg-zinc-800",
                      "group-data-[hover=true]:border-zinc-500",
                      "group-data-[focus=true]:bg-transparent ",
                      "group-data-[focus=true]:border-zinc-400 ",
                      "!cursor-text",
                      "border-zinc-600",
                    ],
                  }}
                />
                <Input
                  isReadOnly
                  label="Status"
                  variant="bordered"
                  defaultValue={currentOverview.status}
                  className="max-w-sm"
                  classNames={{
                    label: "group-data-[filled-within=true]:text-zinc-400",
                    input: [
                      "bg-transparent",
                      "group-data-[has-value=true]:text-white/90",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                      "bg-transparent",
                      "group-data-[hover=true]:bg-zinc-800",
                      "group-data-[hover=true]:border-zinc-500",
                      "group-data-[focus=true]:bg-transparent ",
                      "group-data-[focus=true]:border-zinc-400 ",
                      "!cursor-text",
                      "border-zinc-600",
                    ],
                  }}
                />
                <Input
                  isReadOnly
                  label="Montant TTC"
                  variant="bordered"
                  defaultValue={currentOverview.ttc}
                  className="max-w-sm"
                  classNames={{
                    label: "group-data-[filled-within=true]:text-zinc-400",
                    input: [
                      "bg-transparent",
                      "group-data-[has-value=true]:text-white/90",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                      "bg-transparent",
                      "group-data-[hover=true]:bg-zinc-800",
                      "group-data-[hover=true]:border-zinc-500",
                      "group-data-[focus=true]:bg-transparent ",
                      "group-data-[focus=true]:border-zinc-400 ",
                      "!cursor-text",
                      "border-zinc-600",
                    ],
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={onClose}>
                  Fermer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
