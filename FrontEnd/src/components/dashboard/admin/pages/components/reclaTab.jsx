import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
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
import {
  updateReclamationThunk,
  deleteReclamationThunk,
} from "../../../../../session/thunks/adminthunk.jsx";

const INITIAL_VISIBLE_COLUMNS = [
  "rec_id",
  "nom",
  "rec_type",
  "rec_date",
  "rec_response",
  "rec_etat",
  "actions",
];

const SMALL_DEVICE_COLUMNS = [
  "rec_id",
  "nom",
  "rec_type",
  "rec_etat",
  "actions",
];

const statusColorMap = {
  annulée: "grey",
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
    column: "rec_etat",
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

  const handleEditClick = (reclamation) => {
    setCurrentReclamation({
      rec_id: reclamation.rec_id,
      nom: reclamation.nom,
      rec_type: reclamation.rec_type,
      rec_desc: reclamation.rec_desc,
      rec_date: reclamation.rec_date,
      rec_etat: reclamation.rec_etat,
      rec_response: reclamation.rec_response,
    });
    setEditModalOpen(true);
  };

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
      filteredUsers = filteredUsers.filter((item) =>
        Array.from(statusFilter).includes(item.rec_etat)
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
  const handleStatusChange = (rec_etat) => {
    setCurrentReclamation({ ...currentReclamation, rec_etat });
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

  const dispatch = useDispatch();

  const handleEditReclamation = async () => {
    // Validate all fields before dispatching
    if (
      currentReclamation.rec_id === "" ||
      currentReclamation.rec_etat === ""
    ) {
      // Handle invalid form data
      return;
    }

    // Prepare the data to dispatch
    const reclamationData = {
      rec_id: currentReclamation.rec_id,
      rec_etat: currentReclamation.rec_etat,
    };

    console.log(reclamationData);

    // Show loading toast while processing
    const loadingToastId = toast.loading("Updating reclamation...", {
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
      // Dispatch the action to update reclamation
      const response = await dispatch(updateReclamationThunk(reclamationData));

      // Clear loading toast
      toast.dismiss(loadingToastId);
      console.log('response');
      console.log(response);

      console.log('response');

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
        toast.error(response.payload.status, {
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
      console.error("Error editing reclamation:", error);
      toast.error("An error occurred while editing reclamation", {
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

  //delete a reclamation
  const handleDeleteReclamation = async () => {
    // Get the Invoice ID
    const rec_id = currentReclamation.rec_id;

    // Validate all fields before dispatching
    if (!rec_id) {
      console.error("Invalid invoice ID for deletion:", rec_id);
      return;
    }

    // Prepare data for deletion
    const data = {
      rec_id: rec_id,
    };

    console.log(data);

    try {
      // Dispatch action to delete invoice
      const response = await dispatch(deleteReclamationThunk(data));

      console.log(response);

      // Handle response
      if (response && response.payload.status === "success") {
        toast.success(response.payload.status, {
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
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[item.rec_etat]}
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
                  <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                    <Input
                      isReadOnly
                      label="Résidant"
                      variant="bordered"
                      labelPlacement="outside"
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
                      defaultValue={currentReclamation.nom}
                      onChange={(e) =>
                        setCurrentReclamation({
                          ...currentReclamation,
                          nom: e.target.value,
                        })
                      }
                    />
                    <Input
                      isReadOnly
                      label="Type de Réclamation"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue={currentReclamation.rec_type}
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
                        setCurrentReclamation({
                          ...currentReclamation,
                          type_rec: e.target.value,
                        })
                      }
                    />
                    <Textarea
                      isReadOnly
                      label="Description"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue={currentReclamation.rec_desc}
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
                        setCurrentReclamation({
                          ...currentReclamation,
                          rec_desc: e.target.value,
                        })
                      }
                    />
                    <Input
                      isReadOnly
                      label="Date de Réclamation"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue={currentReclamation.rec_date}
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
                        setCurrentReclamation({
                          ...currentReclamation,
                          rec_date: e.target.value,
                        })
                      }
                    />
                    <Input
                      isReadOnly
                      label="Status"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue={currentReclamation.rec_etat}
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
                        setCurrentReclamation({
                          ...currentReclamation,
                          rec_etat: e.target.value,
                        })
                      }
                    />
                    <Input
                      isReadOnly
                      label="Date de Résolution"
                      variant="bordered"
                      labelPlacement="outside"
                      defaultValue={currentReclamation.rec_response}
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
                        setCurrentReclamation({
                          ...currentReclamation,
                          rec_response: e.target.value,
                        })
                      }
                    />
                  </div>
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
                        onChange={(e) =>
                          setCurrentReclamation({
                            ...currentReclamation,
                            nom: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setCurrentReclamation({
                            ...currentReclamation,
                            num_de_log: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setCurrentReclamation({
                            ...currentReclamation,
                            type_log: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setCurrentReclamation({
                            ...currentReclamation,
                            ameliored: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                      <Input
                        isReadOnly
                        type="text"
                        label="Description:"
                        variant="bordered"
                        defaultValue={currentReclamation.rec_desc}
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
                        onChange={(e) =>
                          setCurrentReclamation({
                            ...currentReclamation,
                            rec_desc: e.target.value,
                          })
                        }
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
                    defaultValue={currentReclamation?.rec_desc}
                    onChange={(e) =>
                      setCurrentReclamation({
                        ...currentReclamation,
                        rec_desc: e.target.value,
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
                    defaultValue={currentReclamation?.rec_date}
                    onChange={(e) =>
                      setCurrentReclamation({
                        ...currentReclamation,
                        rec_date: e.target.value,
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
                    defaultValue={currentReclamation?.rec_etat}
                    onSelectionChange={(keys) =>
                      handleStatusChange(keys.currentKey)
                    }
                  >
                    <SelectItem key="résolu" textValue="résolu">
                      Résolu
                    </SelectItem>
                    <SelectItem key="non résolu" textValue="non résolu">
                      Inachevé
                    </SelectItem>
                    <SelectItem key="en attente" textValue="en attente">
                      Attente
                    </SelectItem>
                    <SelectItem key="Annulé" textValue="Annulé">
                      Annulée
                    </SelectItem>
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Fermer
                </Button>
                <Button color="primary" onClick={handleEditReclamation}>
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
                {currentReclamation && currentReclamation.nom && (
                  <Button
                    color="primary"
                    onClick={() => {
                      console.log("Current reclamation:", currentReclamation);
                      if (currentReclamation && currentReclamation.rec_type) {
                        handleDeleteReclamation(currentReclamation.rec_type);
                      } else {
                        console.error(
                          "Invalid Reclamation ID for deletion:",
                          currentReclamation?.rec_type
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
      rec_id: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired,
      rec_type: PropTypes.string.isRequired,
      rec_desc: PropTypes.string.isRequired,
      rec_date: PropTypes.string.isRequired,
      rec_etat: PropTypes.string.isRequired,
      rec_response: PropTypes.string.isRequired,
    })
  ).isRequired,
  statusReclOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
};

export default ReclamationTable;
