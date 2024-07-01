import React, { useState, useEffect } from "react";
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { SearchIcon } from "../Icons/SearchIcon";
import { EditIcon } from "../Icons/EditIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import { VerticalDotsIcon } from "../Icons/VerticalDotsIcon";
import PropTypes from "prop-types";
import "./customWrappers.scss";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "num_de_log",
  "nom",
  "type_log",
  "ameliored",
  "consumE",
  "consumW",
  "actions",
];
const SMALL_DEVICE_COLUMNS = [
  "num_de_log",
  "nom",
  "type_log",
  "consumE",
  "consumW",
  "actions",
];

const ConsumTable = ({ columns, rows, title }) => {
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

  const [currentConsum, setCurrentConsum] = useState(null);

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
  //   const {
  //     isOpen: isDeleteModalOpen,
  //     onOpen: openDeleteModal,
  //     onOpenChange: setDeleteModalOpen,
  //   } = useDisclosure();

  const pages = Math.ceil(rows.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

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

  const handleDotsIconClick = (consum) => {
    setCurrentConsum(consum);
  };

  const handleDetailsIconClick = (consum) => {
    setCurrentConsum(consum);
    openDetailsModal(true);
  };
  const handleEditIconClick = (consum) => {
    setCurrentConsum(consum);
    openEditModal();
  };
  //   const handleDeleteIconClick = (consum) => {
  //     setCurrentConsum(consum);
  //     openDeleteModal();
  //   };

  const renderCell = React.useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
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
                    <span
                      className="icon-wrapper"
                      onClick={handleDotsIconClick}
                    >
                      <VerticalDotsIcon />
                    </span>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Action event example"
                    onAction={(key) => {
                      if (key === "details") handleDetailsIconClick(user);
                      if (key === "edit") handleEditIconClick(user);
                      //   if (key === "delete") handleDeleteIconClick(user);
                    }}
                  >
                    <DropdownItem key="details" startContent={<EyeIcon />}>
                      Détails
                    </DropdownItem>
                    <DropdownItem key="edit" startContent={<EditIcon />}>
                      Modifier
                    </DropdownItem>
                    {/* <DropdownItem
                      key="delete"
                      color="danger"
                      className="text-danger"
                      startContent={<DeleteIcon />}
                    >
                      Supprimer
                    </DropdownItem> */}
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

                  {/* <Tooltip
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
                  </Tooltip> */}
                </>
              )}
            </div>
          );
        default:
          return cellValue;
      }
    },
    [isMobile]
  );

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
                size="md"
              >
                Ajouter
              </Button>
              <Modal
                size="lg"
                isOpen={isAddModalOpen}
                onOpenChange={setAddModalOpen}
                classNames={{
                  base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
                  closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Consommation Pour Un Nouveau Résidant 🎉
                      </ModalHeader>
                      <ModalBody>
                        <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4 autocomplete">
                          <Autocomplete
                            defaultItems={rows}
                            label="Résidant"
                            placeholder="Chercher un résidant"
                            className="max-w-sm"
                            classNames={{
                              popoverContent: ["bg-zinc-800", "text-white/90"],
                            }}
                          >
                            {(user) => (
                              <AutocompleteItem key={user.id}>
                                {user.nom}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>

                        </div>

                        <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                          <Input
                            label="Electricité"
                            placeholder="Entrer la consommation"
                            endContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">
                                  kWh
                                </span>
                              </div>
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
                                "bg-zinc-800",
                                "group-data-[hover=true]:bg-zinc-800",
                                "group-data-[focus=true]:bg-zinc-800 ",
                                "!cursor-text",
                              ],
                            }}
                          />

                          <Input
                            label="Eau"
                            placeholder="Entrer la consommation"
                            endContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">
                                  m³
                                </span>
                              </div>
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
                                "bg-zinc-800",
                                "group-data-[hover=true]:bg-zinc-800",
                                "group-data-[focus=true]:bg-zinc-800 ",
                                "!cursor-text",
                              ],
                            }}
                          />
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" onPress={onClose}>
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
          {(user) => (
            <TableRow key={user.id}>
              {(columnKey) => (
                <TableCell>{renderCell(user, columnKey)}</TableCell>
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
                Détails de la Facture
              </ModalHeader>
              <ModalBody>
                {isMobile ? (
                  <>
                    <Input
                      isReadOnly
                      type="text"
                      label="Facture ID:"
                      variant="bordered"
                      defaultValue={currentConsum.id_fac}
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
                      label="Résidant:"
                      variant="bordered"
                      defaultValue={currentConsum.nom}
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
                      defaultValue={currentConsum.type}
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
                      defaultValue={currentConsum.mois}
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
                      defaultValue={currentConsum.echeance}
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
                      defaultValue={currentConsum.status}
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
                      defaultValue={currentConsum.ttc}
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
                  </>
                ) : (
                  <>
                    <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                      <Input
                        isReadOnly
                        type="text"
                        label="Résidant:"
                        variant="bordered"
                        defaultValue={currentConsum.nom}
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
                        label="Profession:"
                        variant="bordered"
                        defaultValue={currentConsum.profession}
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
                        label="ID Logement:"
                        variant="bordered"
                        defaultValue={currentConsum.id_logement}
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
                        label="Type du logement:"
                        variant="bordered"
                        defaultValue={currentConsum.type_log}
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
                        defaultValue={currentConsum.ameliored ? "Oui" : "Non"}
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
                <Button color="danger" onClick={onClose}>
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
                Modifier la consommation de {currentConsum?.nom}
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Input
                    isDisabled
                    type="text"
                    label="Résidant"
                    className="max-w-xs"
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
                    defaultValue={currentConsum?.nom}
                    onChange={(e) =>
                      setCurrentConsum({
                        ...currentConsum,
                        nom: e.target.value,
                      })
                    }
                  />
                  
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center mb-6 md:mb-0 gap-4">
                <Input
                    label="Electricité"
                    placeholder="Entrer la consommation"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">
                          m³
                        </span>
                      </div>
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
                        "bg-zinc-800",
                        "group-data-[hover=true]:bg-zinc-800",
                        "group-data-[focus=true]:bg-zinc-800 ",
                        "!cursor-text",
                      ],
                    }}
                    defaultValue={currentConsum?.consumE}
                    onChange={(e) =>
                      setCurrentConsum({
                        ...currentConsum,
                        consumE: e.target.value,
                      })
                    }
                    />

                  <Input
                    label="Eau"
                    placeholder="Entrer la consommation"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">
                          m³
                        </span>
                      </div>
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
                        "bg-zinc-800",
                        "group-data-[hover=true]:bg-zinc-800",
                        "group-data-[focus=true]:bg-zinc-800 ",
                        "!cursor-text",
                      ],
                    }}
                    defaultValue={currentConsum?.consumW}
                    onChange={(e) =>
                      setCurrentConsum({
                        ...currentConsum,
                        consumW: e.target.value,
                      })
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
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

      {/* <Modal
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
      </Modal> */}
    </>
  );
};

ConsumTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      num_de_log: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired,
      type_log: PropTypes.string.isRequired,
      ameliored: PropTypes.string.isRequired,
      consumE: PropTypes.string.isRequired,
      consumW: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
};

export default ConsumTable;
