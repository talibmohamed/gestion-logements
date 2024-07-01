import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import {
  addFactureThunk,
  updateFactureThunk,
  deleteFactureThunk,
} from "../../../../../session/thunks/adminthunk.jsx";

const INITIAL_VISIBLE_COLUMNS = [
  "fac_id",
  "nom",
  "fac_type",
  "fac_date",
  "fac_echeance",
  "fac_etat",
  "fac_total",
  "actions",
];
const SMALL_DEVICE_COLUMNS = [
  "nom",
  "fac_type",
  "fac_echeance",
  "fac_etat",
  "actions",
];

const statusColorMap = {
  payée: "secondary",
  "en retard": "primary",
  "en attente": "warning",
};

const FactureTable = ({ columns, rows, statusOptions, title }) => {
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
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: setDeleteModalOpen,
  } = useDisclosure();

  const [newFacture, setNewFacture] = useState({
    fac_id: "",
    res_id: "",
    nom: "",
    fac_type: "",
    fac_date: "",
    fac_echeance: "",
    fac_etat: "",
    fac_total: "",
  });

  const [currentFacture, setCurrentFacture] = useState({});

  const handleEditClick = (facture) => {
    setCurrentFacture({
      fac_id: facture.fac_id,
      nom: facture.nom,
      fac_type: facture.fac_type,
      fac_date: facture.fac_date,
      fac_echeance: facture.fac_echeance,
      fac_etat: facture.fac_etat,
      fac_total: facture.fac_total,
    });
    setEditModalOpen(true);
  };

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
      filteredUsers = filteredUsers.filter((item) =>
        item.nom.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((item) =>
        Array.from(statusFilter).includes(item.fac_etat)
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

  const handleDotsIconClick = (facture) => {
    setCurrentFacture(facture);
  };

  const handleDetailsIconClick = (facture) => {
    setCurrentFacture(facture);
    openDetailsModal(true);
  };
  const handleEditIconClick = (facture) => {
    setCurrentFacture(facture);
    openEditModal();
  };
  const handleDeleteIconClick = (facture) => {
    setCurrentFacture(facture);
    openDeleteModal();
  };

  const handleStatusChange = (fac_etat) => {
    setCurrentFacture({ ...currentFacture, fac_etat });
  };

  const dispatch = useDispatch();

  const handleAddFacture = async () => {
    // Validate all fields before dispatching
    if (
      newFacture.fac_id === "" ||
      newFacture.nom === "" ||
      newFacture.fac_type === "" ||
      newFacture.fac_date === "" ||
      newFacture.fac_echeance === "" ||
      newFacture.fac_etat === "" ||
      newFacture.fac_total === ""
    ) {
      // Handle invalid form data
      return;
    }

    console.log(newFacture);

    // Prepare the data to dispatch
    const factureData = {
      nom: newFacture.nom,
      fac_type: newFacture.fac_type,
      fac_date: newFacture.fac_date,
      fac_echeance: newFacture.fac_echeance,
      fac_etat: newFacture.fac_etat,
      fac_total: newFacture.fac_total,
    };

    console.log(factureData);

    // Show loading toast while processing
    const loadingToastId = toast.loading("Adding facture...", {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: 0,
      theme: "dark",
    });

    try {
      // Dispatch the action to add facture
      const response = await dispatch(addFactureThunk(factureData));

      // Clear loading toast
      toast.dismiss(loadingToastId);

      // Display success message
      if (response && response.payload.status === "success") {
        toast.success(response.payload.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: "dark",
        });
        // Clear the form or close modal after successful submission
        setAddModalOpen(false);
        setNewFacture({
          nom: "",
          fac_type: "",
          fac_date: "",
          fac_echeance: "",
          fac_etat: "",
          fac_total: "",
        });
      } else if (response && response.payload.status === "alert") {
        toast.error(response.payload.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: "dark",
        });
      } else {
        // Handle other statuses or errors
        toast.error(response.payload.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error adding Facture:", error);
      toast.error("An error occurred while adding Facture", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: 0,
        theme: "dark",
      });
    }
  };

  const handleEditFacture = async () => {
    // Validate all fields before dispatching
    if (
      currentFacture.fac_date === "" ||
      currentFacture.fac_echeance === "" ||
      currentFacture.fac_etat === "" ||
      currentFacture.fac_total === ""
    ) {
      // Handle invalid form data
      return;
    }

    // Prepare the data to dispatch
    const factureData = {
      fac_date: currentFacture.fac_date,
      fac_echeance: currentFacture.fac_echeance,
      fac_etat: currentFacture.fac_etat,
      fac_total: currentFacture.fac_total,
    };

    console.log(factureData);

    // Show loading toast while processing
    const loadingToastId = toast.loading("Updating facture...", {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: 0,
      theme: "dark",
    });

    try {
      // Dispatch the action to update facture
      const response = await dispatch(updateFactureThunk(factureData));

      // Clear loading toast
      toast.dismiss(loadingToastId);

      // Display success message
      if (response && response.payload.status === "success") {
        toast.success("facture edited successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: "dark",
        });

        // Clear the form or close modal after successful submission
        setEditModalOpen(false);
      } else if (response && response.payload.status === "alert") {
        toast.error(response.payload.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: "dark",
        });
      } else {
        // Handle other statuses or errors
        toast.error("Failed to edit facture", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error editing facture:", error);
      toast.error("An error occurred while editing facture", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: 0,
        theme: "dark",
      });
    }
  };

  //delete a facture
  const handleDeleteFacture = async () => {
    const statut = currentFacture.fac_etat;

    if (statut === "en attente") {
      setDeleteModalOpen(false);

      toast.error("Facture en attente, impossible de la supprimer", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: 0,
        theme: "dark",
      });
      return;
    }

    // Get the Invoice ID
    const fac_id = currentFacture.fac_id;

    // Validate all fields before dispatching
    if (!fac_id) {
      console.error("Invalid invoice ID for deletion:", fac_id);
      return;
    }

    // Prepare data for deletion
    const data = {
      fac_id: fac_id,
    };

    console.log(data);

    try {
      // Dispatch action to delete invoice
      const response = await dispatch(deleteFactureThunk(data));

      console.log(response);

      // Handle response
      if (response && response.payload.status === "success") {
        toast.success("Facture deleted successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: "dark",
        });
      } else {
        // Handle other statuses or errors
        toast.error("Failed to delete invoice", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: "dark",
        });
      }

      // Clear the form or close modal after successful deletion
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("An error occurred while deleting invoice", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: 0,
        theme: "dark",
      });
    }
  };

  const residants = useSelector((state) => {
    return state.residants.residants.map((resident) => ({
      res_id: resident.res_id,
      nom: resident.nom,
      prenom: resident.prenom,
    }));
  });

  const renderCell = React.useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "fac_etat":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[item.fac_etat]}
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
                      if (key === "details") handleDetailsIconClick(item);
                      if (key === "edit") handleEditIconClick(item);
                      if (key === "delete") handleDeleteIconClick(item);
                    }}
                  >
                    <DropdownItem key="details" startContent={<EyeIcon />}>
                      Détails
                    </DropdownItem>
                    <DropdownItem key="edit" startContent={<EditIcon />}>
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
                      onClick={() => handleDetailsIconClick(item)}
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
                      onClick={() => handleEditIconClick(item)}
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
                      onClick={() => handleDeleteIconClick(item)}
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
                Ajouter une facture
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
                        Ajouter une facture
                      </ModalHeader>
                      <ModalBody>
                        <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4 autocomplete">
                          <Autocomplete
                            defaultItems={residants}
                            label="Résidant"
                            placeholder="Chercher un résidant"
                            className="max-w-sm"
                            classNames={{
                              popoverContent: ["bg-zinc-800", "text-white/90"],
                            }}
                          >
                            {(item) => (
                              <AutocompleteItem key={item.res_id}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <span>{item.nom} {item.prenom}</span>
                                  <span>{'RES' + item.res_id}</span>
                                </div>
                              </AutocompleteItem>
                            )}                      
                          </Autocomplete>

                          <Select
                            label="Type de Facture"
                            placeholder="Choisir le type de facture"
                            className="max-w-sm"
                            classNames={{
                              label: "group-data-[filled=true]:text-zinc-400",
                              value:
                                "group-data-[has-value=true]:text-white/90",
                              trigger: [
                                "bg-zinc-800",
                                "text-white/90",
                                "placeholder:text-white/60",
                                "data-[hover=true]:bg-zinc-800",
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
                            value={newFacture.fac_type}
                            onChange={(e) =>
                              setnewFacture({
                                ...newFacture,
                                fac_type: e.target.value,
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

                        <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
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
                            value={newFacture.fac_total}
                            onChange={(e) =>
                              setnewFacture({
                                ...newFacture,
                                fac_total: e.target.value,
                              })
                            }
                          />

                          <Select
                            isDisabled
                            label="Status"
                            defaultSelectedKeys={["Attente"]}
                            className="max-w-sm"
                            classNames={{
                              label: "group-data-[filled=true]:text-zinc-400",
                              value:
                                "group-data-[has-value=true]:text-white/90",
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
                            value={newFacture.fac_etat}
                            onChange={(e) =>
                              setnewFacture({
                                ...newFacture,
                                fac_etat: e.target.value,
                              })
                            }
                          >
                            <SelectItem key="Attente" value="attente">
                              Attente
                            </SelectItem>
                          </Select>
                        </div>

                        {/* <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4 datePicker">
                          <DatePicker
                            label="Mois de consommation"
                            className="max-w-sm"
                            value={new Date(newFacture.fac_date)}
                            onChange={(e) =>
                              setnewFacture({
                                ...newFacture,
                                fac_date:new Date(e.target.value),
                              })
                            }
                          />
                          <DatePicker
                            label="Echeance"
                            className="max-w-sm"
                            value={new Date(newFacture.fac_echeance)}
                            onChange={(e) =>
                              setnewFacture({
                                ...newFacture,
                                fac_echeance: new Date(e.target.value),
                              })
                            }
                          />
                        </div> */}
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" onPress={onClose}>
                          Close
                        </Button>
                        <Button color="primary" onPress={handleAddFacture}>
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
                {/* {isMobile ? ( */}
                <>
                  <Input
                    isReadOnly
                    type="text"
                    label="Facture ID:"
                    variant="bordered"
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
                    defaultValue={currentFacture?.fac_id}
                    onChange={(e) =>
                      setCurrentFacture({
                        ...currentFacture,
                        fac_id: e.target.value,
                      })
                    }
                  />

                  <Input
                    isReadOnly
                    type="text"
                    label="Résidant:"
                    variant="bordered"
                    defaultValue={currentFacture.nom}
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
                    onChange={(e) =>
                      setCurrentFacture({
                        ...currentFacture,
                        nom: e.target.value,
                      })
                    }
                  />

                  <Input
                    isReadOnly
                    type="text"
                    label="Type de Facture:"
                    variant="bordered"
                    defaultValue={currentFacture.fac_type}
                    onChange={(e) =>
                      setCurrentFacture({
                        ...currentFacture,
                        fac_type: e.target.value,
                      })
                    }
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
                    defaultValue={currentFacture.fac_date}
                    onChange={(e) =>
                      setCurrentFacture({
                        ...currentFacture,
                        fac_date: e.target.value,
                      })
                    }
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
                    defaultValue={currentFacture.fac_echeance}
                    onChange={(e) =>
                      setCurrentFacture({
                        ...currentFacture,
                        fac_echeance: e.target.value,
                      })
                    }
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
                    defaultValue={currentFacture.fac_etat}
                    onChange={(e) =>
                      setCurrentFacture({
                        ...currentFacture,
                        fac_etat: e.target.value,
                      })
                    }
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
                    defaultValue={currentFacture.fac_total}
                    onChange={(e) =>
                      setCurrentFacture({
                        ...currentFacture,
                        fac_total: e.target.value,
                      })
                    }
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
                {/* ) : (
                  <>
                    <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                      <Input
                        isReadOnly
                        type="text"
                        label="Résidant:"
                        variant="bordered"
                        defaultValue={currentInvoice.nom}
                        onChange={(e) =>
                          setCurrentResidant({
                            ...currentResidant,
                            nom: e.target.value,
                          })
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

                      <Input
                        isReadOnly
                        type="text"
                        label="Profession:"
                        variant="bordered"
                        defaultValue={currentInvoice.profession}
                        onChange={(e) =>
                          setCurrentResidant({
                            ...currentResidant,
                            profession: e.target.value,
                          })
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
                        label="ID Logement:"
                        variant="bordered"
                        defaultValue={currentInvoice.log_id}
                        onChange={(e) =>
                          setCurrentResidant({
                            ...currentResidant,
                            log_id: e.target.value,
                          })
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

                      <Input
                        isReadOnly
                        type="text"
                        label="Type du logement:"
                        variant="bordered"
                        defaultValue={currentInvoice.type_log}
                        onChange={(e) =>
                          setCurrentResidant({
                            ...currentResidant,
                            type_log: e.target.value,
                          })
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
                      <Input
                        isReadOnly
                        type="text"
                        label="Amélioré:"
                        variant="bordered"
                        defaultValue={currentInvoice.ameliored ? "Oui" : "Non"}
                        onChange={(e) =>
                          setCurrentResidant({
                            ...currentResidant,
                            ameliored: e.target.value,
                          })
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
                  </>
                )} */}
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
                Modifier la Facture
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
                    defaultValue={currentFacture?.nom}
                    onChange={(e) =>
                      setCurrentFacture({
                        ...currentFacture,
                        nom: e.target.value,
                      })
                    }
                  />
                  <Select
                    label="Type de Facture"
                    placeholder="Choisir le type de facture"
                    className="max-w-xs"
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
                    defaultValue={currentFacture?.fac_type}
                    onChange={(value) =>
                      setCurrentFacture({
                        ...currentFacture,
                        fac_type: value,
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

                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center mb-6 md:mb-0 gap-4">
                  <Select
                    label="Status"
                    placeholder="Choisir le statut"
                    className="max-w-xs "
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
                    color="warning"
                    defaultValue={currentFacture?.fac_etat}
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
                    className="max-w-xs"
                    classNames={{
                      label: "text-white/90",
                      input: [
                        "bg-zinc-800",
                        "group-data-[has-value=true]:text-white/90",
                      ],
                      innerWrapper: "bg-zinc-800",
                      inputWrapper: [
                        "bg-zinc-800",
                        "group-data-[hover=true]:bg-zinc-800",
                        "group-data-[focus=true]:bg-zinc-800 ",
                        "group-data-[focus=true]:border-zinc-400 ",
                        "!cursor-text",
                      ],
                    }}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">$</span>
                      </div>
                    }
                    defaultValue={currentFacture?.fac_total}
                    onChange={(e) =>
                      setCurrentFacture({
                        ...currentFacture,
                        fac_total: e.target.value,
                      })
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Fermer
                </Button>
                <Button color="primary" onClick={handleEditFacture}>
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
                {currentFacture && currentFacture.nom && (
                  <Button
                    color="primary"
                    onClick={() => {
                      console.log("Current Facture:", currentFacture);
                      if (currentFacture && currentFacture.nom) {
                        handleDeleteFacture(currentFacture.nom);
                      } else {
                        console.error(
                          "Invalid Facture ID for deletion:",
                          currentFacture?.nom
                        );
                      }
                    }}
                  >
                    Continuer
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

FactureTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      fac_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      nom: PropTypes.string.isRequired,
      fac_type: PropTypes.string.isRequired,
      fac_date: PropTypes.string.isRequired,
      fac_echeance: PropTypes.string.isRequired,
      fac_etat: PropTypes.string.isRequired,
      fac_total: PropTypes.string.isRequired,
    })
  ).isRequired,
  statusOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
};

export default FactureTable;
