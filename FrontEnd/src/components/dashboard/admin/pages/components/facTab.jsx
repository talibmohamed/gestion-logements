import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
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
import { SearchIcon } from "../Icons/SearchIcon";
import { EditIcon } from "../Icons/EditIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import PropTypes from "prop-types";

const INITIAL_VISIBLE_COLUMNS = [
  // "id",
  "id_res",
  "nom",
  "type",
  "mois",
  "echeance",
  "status",
  "ttc",
  "actions",
];

const statusColorMap = {
  payé: "secondary",
  retard: "primary",
  attente: "warning",
};

const InvoiceTable = ({ columns, rows, statusOptions, title }) => {
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "status",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const [currentInvoice, setCurrentInvoice] = useState(null);
  const {
    isOpen: isAddModalOpen,
    onOpen: openAddModal,
    onOpenChange: setAddModalOpen,
  } = useDisclosure();
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

  const pages = Math.ceil(rows.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...rows];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nom.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [rows, filterValue, statusFilter]);

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

  const handleDetailsIconClick = (invoice) => {
    setCurrentInvoice(invoice);
    openDetailsModal(true);
  };
  const handleEditIconClick = (invoice) => {
    setCurrentInvoice(invoice);
    openEditModal();
  };
  const handleStatusChange = (status) => {
    setCurrentInvoice({ ...currentInvoice, status });
  };
  const handleSave = () => {
    // to handle saving the updated data
    console.log("Updated Invoice:", currentInvoice);
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

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        {title && <h2 className="table-title">{title}</h2>}
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Chercher par nom..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <>
              <Button
                onPress={openAddModal}
                className="bg-foreground text-background text-sm"
                size="sm"
              >
                Ajouter une Facture
              </Button>
              <Modal
                size="lg"
                isOpen={isAddModalOpen}
                onOpenChange={setAddModalOpen}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Ajouter Une Facture
                      </ModalHeader>
                      <ModalBody>
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                          <Autocomplete
                            defaultItems={rows}
                            label="Résidant"
                            placeholder="Chercher un résidant"
                            className="max-w-xs"
                          >
                            {(user) => (
                              <AutocompleteItem key={user.id}>
                                {user.nom}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>

                          <Select
                            label="Type de Facture"
                            placeholder="Choisir le type de facture"
                            className="max-w-xs"
                          >
                            <SelectItem key="eau" value="eau">
                              Eau
                            </SelectItem>
                            <SelectItem key="electricite" value="electricite">
                              Electricite
                            </SelectItem>
                          </Select>
                        </div>

                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                          <Input
                            type="price"
                            label="Montant TTC"
                            placeholder="Entrer le montant TTC"
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">
                                  $
                                </span>
                              </div>
                            }
                          />

                          <Select
                            isDisabled
                            label="Status"
                            defaultSelectedKeys={["Attente"]}
                            className="max-w-xs"
                            color="warning"
                          >
                            <SelectItem key="Attente" value="attente">
                              Attente
                            </SelectItem>
                          </Select>
                        </div>

                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                          <DatePicker label="Mois de consommation " />
                          <DatePicker label="Echeance" />
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Close
                        </Button>
                        <Button color="primary" onPress={onClose}>
                          Enregistrer
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    openAddModal,
    isAddModalOpen,
    setAddModalOpen,
    title,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
      </div>
    );
  }, [page, pages, hasSearchFilter]);

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
                    defaultValue={currentInvoice.nom}
                    className="max-w-xs"
                  />

                  <Input
                    isReadOnly
                    type="text"
                    label="Profession:"
                    variant="bordered"
                    defaultValue={currentInvoice.profession}
                    className="max-w-xs"
                  />
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Input
                    isReadOnly
                    type="text"
                    label="ID Logement:"
                    variant="bordered"
                    defaultValue={currentInvoice.id_logement}
                    className="max-w-xs"
                  />

                  <Input
                    isReadOnly
                    type="text"
                    label="Type du logement:"
                    variant="bordered"
                    defaultValue={currentInvoice.type_log}
                    className="max-w-xs"
                  />
                  <Input
                    isReadOnly
                    type="text"
                    label="Amélioré:"
                    variant="bordered"
                    defaultValue={currentInvoice.ameliored ? "Oui" : "Non"}
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
                Modifier la Facture
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Input
                    isDisabled
                    type="text"
                    label="Résidant"
                    className="max-w-xs"
                    defaultValue={currentInvoice?.nom}
                    onChange={(e) =>
                      setCurrentInvoice({
                        ...currentInvoice,
                        nom: e.target.value,
                      })
                    }
                  />
                  <Select
                    label="Type de Facture"
                    placeholder="Choisir le type de facture"
                    className="max-w-xs"
                    defaultValue={currentInvoice?.typeFacture}
                    onChange={(value) =>
                      setCurrentInvoice({
                        ...currentInvoice,
                        typeFacture: value,
                      })
                    }
                  >
                    <SelectItem key="eau" value="eau">
                      Eau
                    </SelectItem>
                    <SelectItem key="electricite" value="electricite">
                      Electricite
                    </SelectItem>
                  </Select>
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Select
                    label="Status"
                    placeholder="Choisir le statut"
                    className="max-w-xs text-black"
                    color="warning"
                    defaultValue={currentInvoice?.status}
                    onSelectionChange={(keys) =>
                      handleStatusChange(keys.currentKey)
                    }
                  >
                    <SelectItem key="payé" textValue="payé">
                      payé
                    </SelectItem>
                    <SelectItem key="retard" textValue="retard">
                      retard
                    </SelectItem>
                    <SelectItem key="attente" textValue="attente">
                      attente
                    </SelectItem>
                  </Select>

                  <Input
                    type="price"
                    label="Montant TTC"
                    placeholder="Entrer le montant TTC"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">$</span>
                      </div>
                    }
                    defaultValue={currentInvoice?.ttc}
                    onChange={(e) =>
                      setCurrentInvoice({
                        ...currentInvoice,
                        ttc: e.target.value,
                      })
                    }
                  />
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

InvoiceTable.propTypes = {
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
  statusOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
};

export default InvoiceTable;
