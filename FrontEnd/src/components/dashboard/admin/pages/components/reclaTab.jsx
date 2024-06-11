import React, { useState } from "react";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  DatePicker,
} from "@nextui-org/react";
import { EditIcon } from "../Icons/EditIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import PropTypes from "prop-types";

const INITIAL_VISIBLE_COLUMNS = [
  "id_res",
  "nom",
  "desc",
  "date",
  "sol",
  "status",
  "actions",
];

const statusColorMap = {
  résolu: "secondary",
  inachevé: "primary",
  attente: "warning",
};

const ReclamationTable = ({ columns, rows, statusReclOptions, title }) => {
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "status",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(rows.length / rowsPerPage);

  const [currentReclamation, setCurrentReclamation] = useState(null);
  const {
    isOpen: isDetailsModalOpen,
    onOpen: openDetailsModal,
    onOpenChange: setDetailsModalOpen,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onOpenChange: setEditModalOpen,
  } = useDisclosure();

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...rows];

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusReclOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [rows, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleDetailsIconClick = (reclamation) => {
    setCurrentReclamation(reclamation);
    openDetailsModal(true);
  };
  const handleEditIconClick = (reclamation) => {
    setCurrentReclamation(reclamation);
    openEditModal();
  };
  const handleStatusChange = (status) => {
    setCurrentReclamation({ ...currentReclamation, status });
  };
  const handleSave = () => {
    // to handle saving the updated data
    console.log("Updated Status:", currentReclamation);
    setEditModalOpen(false);
  };

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleDetailsIconClick(user)}
              >
                <EyeIcon />
              </span>
            </Tooltip>

            <Tooltip content="Modifier">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEditIconClick(user)}
              >
                <EditIcon />
              </span>
            </Tooltip>

            <Tooltip color="danger" content="Supprimer">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        {title && <h2 className=" table-title">{title}</h2>}
      </div>
    );
  }, [title]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
      </div>
    );
  }, [page, pages]);

  return (
    <>
      <Table
        isCompact
        removeWrapper
        isHeaderSticky
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        bottomContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        size="lg"
        isOpen={isDetailsModalOpen}
        onOpenChange={() => setDetailsModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Détails de la Facture
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Input
                    isReadOnly
                    type="text"
                    label="Résidant:"
                    variant="bordered"
                    defaultValue={currentReclamation.nom}
                    className="max-w-xs"
                  />

                  <Input
                    isReadOnly
                    type="text"
                    label="Profession:"
                    variant="bordered"
                    defaultValue={currentReclamation.profession}
                    className="max-w-xs"
                  />
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Input
                    isReadOnly
                    type="text"
                    label="ID Logement:"
                    variant="bordered"
                    defaultValue={currentReclamation.id_logement}
                    className="max-w-xs"
                  />

                  <Input
                    isReadOnly
                    type="text"
                    label="Type du logement:"
                    variant="bordered"
                    defaultValue={currentReclamation.type_log}
                    className="max-w-xs"
                  />
                  <Input
                    isReadOnly
                    type="text"
                    label="Amélioré:"
                    variant="bordered"
                    defaultValue={currentReclamation.ameliored ? "Oui" : "Non"}
                    className="max-w-xs"
                  />
                </div>
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

      <Modal size="lg" isOpen={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modifier le status de la réclamation
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Input
                    isDisabled
                    type="text"
                    label="Résidant"
                    className="max-w-xs"
                    defaultValue={currentReclamation?.nom}
                    onChange={(e) =>
                      setCurrentReclamation({
                        ...currentReclamation,
                        nom: e.target.value,
                      })
                    }
                  />

                  <Input
                    isDisabled
                    type="text"
                    label="Description"
                    className="max-w-xs"
                    defaultValue={currentReclamation?.desc}
                    onChange={(e) =>
                      setCurrentReclamation({
                        ...currentReclamation,
                        nom: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Input
                    isDisabled
                    type="text"
                    label="Date de Réclamation"
                    className="max-w-xs"
                    defaultValue={currentReclamation?.date}
                    onChange={(e) =>
                      setCurrentReclamation({
                        ...currentReclamation,
                        nom: e.target.value,
                      })
                    }
                  />
                  <Select
                    label="Status"
                    placeholder="Choisir le statut"
                    className="max-w-xs text-black"
                    defaultValue={currentReclamation?.status}
                    onSelectionChange={(keys) =>
                      handleStatusChange(keys.currentKey)
                    }
                  >
                    <SelectItem key="resolu" textValue="Résolu">
                      Résolu
                    </SelectItem>
                    <SelectItem key="inacheve" textValue="Inachevé">
                      Inachevé
                    </SelectItem>
                    <SelectItem key="attente" textValue="Attente">
                      Attente
                    </SelectItem>
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Fermer
                </Button>
                <Button color="primary" onClick={handleSave}>
                  Sauvegarder
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

ReclamationTable.propTypes = {
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
      desc: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      sol: PropTypes.string.isRequired,
    })
  ).isRequired,
  statusReclaOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
};

export default ReclamationTable;
