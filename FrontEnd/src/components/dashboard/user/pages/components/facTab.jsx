import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Chip,
  Pagination,
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
} from "@nextui-org/react";
import { SearchIcon } from "../Icons/SearchIcon";
import PropTypes from "prop-types";
import "./customWrappers.scss";
import { EyeIcon } from "../Icons/EyeIcon";
import { VerticalDotsIcon } from "../Icons/VerticalDotsIcon";
import ReadMoreIcon from '@mui/icons-material/ReadMore';

const INITIAL_VISIBLE_COLUMNS = [
  "id_fac",
  "nom",
  "type",
  "mois",
  "echeance",
  "status",
  "ttc",
];

const SMALL_DEVICE_COLUMNS = ["id_fac", "type","echeance", "status", "actions"];

const statusColorMap = {
  payée: "secondary",
  "en retard": "primary",
  "en attente": "warning",
};

const InvoiceTable = ({ columns, rows, statusOptions, title }) => {
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter] = React.useState("all");
  const [currentReclamation, setCurrentReclamation] = useState(null);
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "status",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 15;


  const pages = Math.ceil(rows.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const {
    isOpen: isDetailsModalOpen,
    onOpen: openDetailsModal,
    onOpenChange: setDetailsModalOpen,
  } = useDisclosure();

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

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

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...rows];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.id_fac.toLowerCase().includes(filterValue.toLowerCase())
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

  const handleDotsIconClick = (reclamation) => {
    setCurrentReclamation(reclamation);
  };

  const handleDetailsIconClick = (reclamation) => {
    setCurrentReclamation(reclamation);
    openDetailsModal(true);
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
                      Annuler
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
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
            placeholder="Chercher par id de facture..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
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
                          defaultValue={currentReclamation.type}
                          className="mb-3"
                        />
                        <Input
                          isReadOnly
                          label="Mois de Consommation"
                          variant="bordered"
                          labelPlacement="outside"
                          defaultValue={currentReclamation.mois}
                          className="mb-3"
                        />
                        <Input
                          isReadOnly
                          label="Echeance"
                          variant="bordered"
                          labelPlacement="outside"
                          defaultValue={currentReclamation.echeance}
                          className="mb-3"
                        />
                        <Input
                          isReadOnly
                          label="Status"
                          variant="bordered"
                          labelPlacement="outside"
                          defaultValue={currentReclamation.status}
                          className="mb-3"
                        />
                        <Input
                          isReadOnly
                          label="Montant TTC"
                          variant="bordered"
                          labelPlacement="outside"
                          defaultValue={currentReclamation.ttc}
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
      id_fac: PropTypes.string.isRequired,
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
