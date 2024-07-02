import React, { useState, useEffect } from "react";
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
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Textarea,
} from "@nextui-org/react";
import { EditIcon } from "../Icons/EditIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import { VerticalDotsIcon } from "../Icons/VerticalDotsIcon";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { fetchReclamationsThunk } from "../../../../../session/thunks/adminthunk";

const INITIAL_VISIBLE_COLUMNS = [
  "id_recl",
  "nom",
  "type_recl",
  "date",
  "sol",
  "status",
  "actions",
];

const SMALL_DEVICE_COLUMNS = [
  "id_recl",
  "nom",
  "type_recl",
  "status",
  "actions",
];

const statusColorMap = {
  annulée: "primary",
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
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onOpenChange: setEditModalOpen,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: setDeleteModalOpen,
  } = useDisclosure();

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

  const handleDotsIconClick = (reclamation) => {
    setCurrentDots(reclamation);
  };
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
  const handleDeleteIconClick = (reclamation) => {
    setCurrentReclamation(reclamation);
    openDeleteModal();
  };

  // const dispatch = useDispatch();
  // const reclamationsState = useSelector(state => state.reclamations);
  // const reclamation = reclamationsState?.reclamation || [];

  // console.log("1");
  // console.log(reclamation);
  // console.log("1");


  // useEffect(() => {
  //   dispatch(fetchReclamationsThunk()); 
  // }, [dispatch]); 

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
            {isMobile ? (
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
                    if (key === "details") handleDetailsIconClick(user);
                    if (key === "edit") handleEditIconClick(user);
                    if (key === "delete") handleDeleteIconClick(user);
                  }}
                >
                  <DropdownItem key="details" startContent={<EyeIcon />}>
                    Détails
                  </DropdownItem>
                  <DropdownItem key="edit" startContent={<EyeIcon />}>
                    Modifier
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    color="danger"
                    className="text-danger"
                    startContent={<DeleteIcon />}
                  >
                    Supprimer
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <>
                <Tooltip
                  content="Détails"
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
                  content="Modifier"
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
                    onClick={() => handleEditIconClick(user)}
                  >
                    <EditIcon />
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
              </>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, [isMobile]);

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
                {isMobile ? (
                  <>
                  <Input
                      isReadOnly
                      label="Résidant"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue={currentReclamation.nom}
                      className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                      label="Type de Réclamation"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue={currentReclamation.type_recl}
                      className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                    <Textarea
                      isReadOnly
                      label="Description"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue={currentReclamation.desc}
                      className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                      label="Date de Réclamation"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue={currentReclamation.date}
                      className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                      labelPlacement="outside"
                      defaultValue={currentReclamation.status}
                      className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                      label="Date de Résolution"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue={currentReclamation.sol}
                      className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                  </>
                ) : (
                  <>
                    <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                      <Input
                        isReadOnly
                        type="text"
                        label="Résidant:"
                        variant="bordered"
                        defaultValue={currentReclamation.nom}
                        className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                        label="No du logement:"
                        variant="bordered"
                        defaultValue={currentReclamation.num_de_log}
                        className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                    </div>

                    <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                      <Input
                        isReadOnly
                        type="text"
                        label="Type du logement:"
                        variant="bordered"
                        defaultValue={currentReclamation.type_log}
                        className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                        label="Amélioré:"
                        variant="bordered"
                        defaultValue={
                          currentReclamation.ameliored ? "Oui" : "Non"
                        }
                        className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                      <Input
                        isReadOnly
                        type="text"
                        label="Description:"
                        variant="bordered"
                        defaultValue={currentReclamation.desc}
                        className="max-w-sm"
                        classNames={{
                          label:
                            "group-data-[filled-within=true]:text-zinc-400",
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
                    </div>
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

      <Modal
        size="lg"
        isOpen={isEditModalOpen}
        onOpenChange={setEditModalOpen}
        classNames={{
          base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modifier le status de la réclamation
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Input
                    isDisabled
                    type="text"
                    label="Résidant"
                    className="max-w-sm"
                    classNames={{
                      label: "group-data-[filled-within=true]:text-zinc-400",
                      input: [
                        "bg-transparent",
                        "group-data-[has-value=true]:text-white/90",
                      ],
                      innerWrapper: "bg-transparent",
                      inputWrapper: [
                        "bg-zinc-800",
                        "group-data-[hover=true]:bg-zinc-700",
                        "group-data-[focus=true]:bg-zinc-800 ",
                        "!cursor-text",
                      ],
                    }}
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
                    className="max-w-sm"
                    classNames={{
                      label: "group-data-[filled-within=true]:text-zinc-400",
                      input: [
                        "bg-transparent",
                        "group-data-[has-value=true]:text-white/90",
                      ],
                      innerWrapper: "bg-transparent",
                      inputWrapper: [
                        "bg-zinc-800",
                        "group-data-[hover=true]:bg-zinc-700",
                        "group-data-[focus=true]:bg-zinc-800 ",
                        "!cursor-text",
                      ],
                    }}
                    defaultValue={currentReclamation?.desc}
                    onChange={(e) =>
                      setCurrentReclamation({
                        ...currentReclamation,
                        nom: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Input
                    isDisabled
                    type="text"
                    label="Date de Réclamation"
                    className="max-w-sm"
                    classNames={{
                      label: "group-data-[filled-within=true]:text-zinc-400",
                      input: [
                        "bg-transparent",
                        "group-data-[has-value=true]:text-white/90",
                      ],
                      innerWrapper: "bg-transparent",
                      inputWrapper: [
                        "bg-zinc-800",
                        "group-data-[hover=true]:bg-zinc-700",
                        "group-data-[focus=true]:bg-zinc-800 ",
                        "!cursor-text",
                      ],
                    }}
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
                    className="max-w-sm"
                    classNames={{
                      label: "group-data-[filled=true]:text-zinc-400",
                      value: "group-data-[has-value=true]:text-white/90",
                      trigger: [
                        "bg-zinc-800",
                        "text-white/90",
                        "placeholder:text-white/60",
                        "data-[hover=true]:bg-zinc-700",
                        "group-data-[focus=true]:bg-zinc-800",
                        "group-data-[focus=true]:border-zinc-400",
                      ],
                      content: [
                        "bg-zinc-800",
                        "text-white/90",
                        "border-zinc-800",
                      ],
                      popoverContent: ["bg-zinc-800", "text-white/90"],
                      listboxWrapper: [
                        "bg-zinc-800",
                        "!cursor-text",
                        "text-white/90",
                      ],
                    }}
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
                <Button color="primary" onClick={handleEditIconClick}>
                  Sauvegarder
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
