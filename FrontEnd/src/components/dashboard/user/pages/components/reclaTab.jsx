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
  Textarea,
} from "@nextui-org/react";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import PropTypes from "prop-types";
import "./customWrappers.scss";

const INITIAL_VISIBLE_COLUMNS = [
  "id_recl",
  "type_recl",
  "date",
  "sol",
  "status",
  "actions",
];

const statusColorMap = {
  résolu: "secondary",
  "non résolu": "primary",
  "en attente": "warning",
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
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: setDeleteModalOpen,
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
  const handleDeleteIconClick = (reclamation) => {
    setCurrentReclamation(reclamation);
    openDeleteModal();
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
            <Tooltip
              content="Details"
              delay={0}
              closeDelay={0}
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn",
                    },
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut",
                    },
                  },
                },
              }}
            >
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleDetailsIconClick(user)}
              >
                <EyeIcon />
              </span>
            </Tooltip>

            <Tooltip
              color="danger"
              content="Supprimer"
              delay={0}
              closeDelay={0}
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn",
                    },
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut",
                    },
                  },
                },
              }}
            >
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDeleteIconClick(user)}
              >
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
                <Textarea
                  isReadOnly
                  label="Description"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Enter your description"
                  defaultValue={currentReclamation.desc}
                />
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

      <Modal
        size="md"
        backdrop="blur"
        isOpen={isDeleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        scrollBehavior="inside"
        placement="center"
        classNames={{
          base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl">Attention</ModalHeader>
              <ModalBody>Êtes-vous sûr(e) de vouloir continuer ?</ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  className="text-sm font-medium"
                  onPress={onClose}
                >
                  Fermer
                </Button>
                <Button color="primary">Continuer</Button>
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
      id_recl: PropTypes.string.isRequired,
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
