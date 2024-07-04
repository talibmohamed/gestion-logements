import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { SearchIcon } from "../Icons/SearchIcon";
import { EditIcon } from "../Icons/EditIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import { Eye2Icon } from "../Icons/Eye2Icon";
import { VerticalDotsIcon } from "../Icons/VerticalDotsIcon";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import PropTypes from "prop-types";
import {
  addResidantThunk,
  updateResidantThunk,
  deleteResidantThunk,
} from "../../../../../session/thunks/adminthunk.jsx";

const INITIAL_VISIBLE_COLUMNS = [
  "nom",
  "prenom",
  "cin",
  "email",
  "telephone",
  "profession",
  "ameliored",
  "actions",
];

const SMALL_DEVICE_COLUMNS = [
  "nom",
  "prenom",
  "cin",
  "profession",
  "ameliored",
  "actions",
];

const ResidantTable = ({ columns, rows, title }) => {
  // const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "nom",
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
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onOpenChange: setEditModalOpen,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: setDeleteModalOpen,
  } = useDisclosure();
  const {
    isOpen: isDetailsModalOpen,
    onOpen: openDetailsModal,
    onOpenChange: setDetailsModalOpen,
  } = useDisclosure();

  const [newResidant, setNewResidant] = useState({
    nom: "",
    prenom: "",
    cin: "",
    email: "",
    telephone: "",
    profession: "",
    ameliore: "",
  });

  const [currentResidant, setCurrentResidant] = useState({});
  const handleEditClick = (residant) => {
    setCurrentResidant({
      res_id: residant.res_id,
      nom: residant.nom,
      prenom: residant.prenom,
      cin: residant.cin,
      email: residant.email,
      telephone: residant.telephone,
      profession: residant.profession,
      is_ameliore: residant.is_ameliore,
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
      filteredUsers = filteredUsers.filter((rows) =>
        rows.nom.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [rows, filterValue]);

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

  const handleDotsIconClick = (residant) => {
    setCurrentResidant(residant);
  };

  const handleDetailsIconClick = (residant) => {
    setCurrentResidant(residant);
    openDetailsModal(true);
  };

  const handleEditIconClick = (residant) => {
    setCurrentResidant(residant);
    openEditModal();
  };

  const handleDeleteIconClick = (residant) => {
    setCurrentResidant(residant);
    openDeleteModal();
  };

  const dispatch = useDispatch();

  const handleAddResidant = async () => {
    // Validate all fields before dispatching
    if (
      newResidant.nom === "" ||
      newResidant.prenom === "" ||
      newResidant.cin === "" ||
      newResidant.email === "" ||
      newResidant.profession === "" ||
      newResidant.ameliore === "" ||
      newResidant.telephone === ""
    ) {
      // Handle invalid form data
      return;
    }

    console.log(newResidant);

    // Convert ameliore to a boolean if it's a string "yes" or "no"
    const amelioreBoolean = newResidant.ameliore === "yes";

    // Prepare the data to dispatch
    const residantData = {
      nom: newResidant.nom,
      prenom: newResidant.prenom,
      cin: newResidant.cin,
      email: newResidant.email,
      telephone: newResidant.telephone,
      profession: newResidant.profession,
      is_ameliore: amelioreBoolean,
    };

    console.log(residantData);

    // Show loading toast while processing
    const loadingToastId = toast.loading("Adding residant...", {
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
      // Dispatch the action to add residant
      const response = await dispatch(addResidantThunk(residantData));

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
        setNewResidant({
          profession: "",
          ameliore: "",
          nb_pieces: "",
          superficie: "",
          address: "",
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
      console.error("Error adding residant:", error);
      toast.error("An error occurred while adding residant", {
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

  const handleEditResidant = async () => {
    // Validate all fields before dispatching
    if (
      currentResidant.res_id === "" ||
      currentResidant.nom === "" ||
      currentResidant.prenom === "" ||
      currentResidant.cin === "" ||
      currentResidant.email === "" ||
      currentResidant.profession === "" ||
      currentResidant.ameliore === "" ||
      currentResidant.telephone === ""
    ) {
      // Handle invalid form data
      return;
    }

    // Convert is_ameliore to a boolean if it's a string "yes" or "no"
    const isAmelioreBoolean = currentResidant.ameliore === "yes";

    // Prepare the data to dispatch
    const residantData = {
      res_id: currentResidant.res_id,
      nom: currentResidant.nom,
      prenom: currentResidant.prenom,
      cin: currentResidant.cin,
      email: currentResidant.email,
      telephone: currentResidant.telephone,
      profession: currentResidant.profession,
      is_ameliore: isAmelioreBoolean,
    };

    console.log(residantData);

    // Show loading toast while processing
    const loadingToastId = toast.loading("Updating residant...", {
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
      // Dispatch the action to update residant
      const response = await dispatch(updateResidantThunk(residantData));

      // Clear loading toast
      toast.dismiss(loadingToastId);

      // Display success message
      if (response && response.payload.status === "success") {
        toast.success("Residant edited successfully", {
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
        toast.error("Failed to edit residant", {
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
      console.error("Error editing residant:", error);
      toast.error("An error occurred while editing residant", {
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

  //delete a residant
  const handleDeleteResidant = async () => {
    // const statut = currentResidant.statut;

    // if (statut === "occupé") {
    //   setDeleteModalOpen(false);

    //   toast.error("Residant occupé, impossible de le supprimer", {
    //     position: "bottom-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //     draggable: true,
    //     progress: 0,
    //     theme: "dark",
    //   });
    //   return;
    // }

    // Get the Residant ID
    const res_id = currentResidant.res_id;

    // Validate all fields before dispatching
    if (!res_id) {
      console.error("Invalid residant ID for deletion:", res_id);
      return;
    }

    // Prepare data for deletion
    const data = {
      res_id: res_id,
    };

    console.log(data);

    try {
      // Dispatch action to delete residant
      const response = await dispatch(deleteResidantThunk(data));

      console.log(response);

      // Handle response
      if (response && response.payload.status === "success") {
        toast.success("Residant deleted successfully", {
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
        toast.error("Failed to delete residant", {
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
      console.error("Error deleting residant:", error);
      toast.error("An error occurred while deleting residant", {
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
                    <DropdownItem key="details" startContent={<Eye2Icon />}>
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
                    variant="light"
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
                      className="text-lg text-danger cursor-pointer active:opacity-50 "
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
        {title && <h2 className=" table-title">{title}</h2>}
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Chercher par résidant..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              className="bg-foreground text-background"
              size="md"
              onPress={openAddModal}
            >
              Ajouter
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange]);

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
                Ajouter Un Residant
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Input
                    type="text"
                    label="Nom"
                    placeholder="Enter Nom du residant"
                    className="max-w-sm"
                    classNames={{
                      label: "group-data-[filled-within=true]:text-zinc-400",
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
                    value={newResidant.nom}
                    onChange={(e) =>
                      setNewResidant({ ...newResidant, nom: e.target.value })
                    }
                  />
                  <Input
                    type="text"
                    label="Prenom"
                    placeholder="Enter Prenom du residant"
                    className="max-w-sm"
                    classNames={{
                      label: "group-data-[filled-within=true]:text-zinc-400",
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
                    value={newResidant.prenom}
                    onChange={(e) =>
                      setNewResidant({ ...newResidant, prenom: e.target.value })
                    }
                  />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Select
                    type="text"
                    label="Profession/Type de Residant"
                    placeholder="Choisir le type de residant"
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
                    value={newResidant.profession}
                    onChange={(e) =>
                      setNewResidant({
                        ...newResidant,
                        profession: e.target.value,
                      })
                    }
                  >
                    <SelectItem key="ouvrier" value="ouvrier">
                      Ouvrier
                    </SelectItem>
                    <SelectItem key="cadre" value="cadre">
                      Cadre
                    </SelectItem>
                    <SelectItem key="agent" value="agent">
                      Agent de maîtrise
                    </SelectItem>
                  </Select>
                  <Select
                    type="text"
                    label="Amelioré"
                    placeholder="Choisir le type de residant"
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
                    value={newResidant.ameliore}
                    onChange={(e) =>
                      setNewResidant({
                        ...newResidant,
                        ameliore: e.target.value,
                      })
                    }
                  >
                    <SelectItem key="yes" value="yes">
                      Oui
                    </SelectItem>
                    <SelectItem key="no" value="no">
                      Non
                    </SelectItem>
                  </Select>
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  {/* cin */}
                  <Input
                    type="text"
                    label="CIN"
                    placeholder="Entrer le CIN"
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
                    value={newResidant.cin}
                    onChange={(e) =>
                      setNewResidant({ ...newResidant, cin: e.target.value })
                    }
                  />
                  {/* telephone */}
                  <Input
                    type="text"
                    label="Telephone"
                    placeholder="Entrer le téléphone"
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
                    value={newResidant.telephone}
                    onChange={(e) =>
                      setNewResidant({
                        ...newResidant,
                        telephone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  {/* email */}
                  <Input
                    type="text"
                    label="Email"
                    placeholder="Entrer l'email"
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
                    value={newResidant.email}
                    onChange={(e) =>
                      setNewResidant({ ...newResidant, email: e.target.value })
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
              <Button
                  color="danger"
                  variant="light"
                  className="text-sm font-medium" onPress={onClose}>
                  Fermer
                </Button>
                <Button color="primary" onPress={handleAddResidant}>
                  Enregistrer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
                Détails sur le residant
              </ModalHeader>
              <ModalBody>
                <>
                  <Input
                    isReadOnly
                    type="text"
                    label="Nom"
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
                    defaultValue={currentResidant?.nom}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        nom: e.target.value,
                      })
                    }
                  />

                  <Input
                    isReadOnly
                    type="text"
                    label="Prénom"
                    variant="bordered"
                    defaultValue={currentResidant.prenom}
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
                      setCurrentResidant({
                        ...currentResidant,
                        prenom: e.target.value,
                      })
                    }
                  />

                  <Input
                    isReadOnly
                    type="text"
                    label="Cin"
                    variant="bordered"
                    defaultValue={currentResidant.cin}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        cin: e.target.value,
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
                    label="Email"
                    variant="bordered"
                    defaultValue={currentResidant.email}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        email: e.target.value,
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
                    label="Profession"
                    variant="bordered"
                    defaultValue={currentResidant.profession}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        profession: e.target.value,
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
                    label="Téléphone"
                    variant="bordered"
                    defaultValue={currentResidant.telephone}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        telephone: e.target.value,
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
                    label="Amelioré"
                    variant="bordered"
                    defaultValue={currentResidant.ameliored ? "Oui" : "Non"}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        ameliored: e.target.value,
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
                </>{" "}
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
                Modifier les détails du residant
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Input
                    type="text"
                    label="Nom"
                    placeholder="Entrer le nom du residant"
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
                    defaultValue={currentResidant?.nom}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        nom: e.target.value,
                      })
                    }
                  />

                  <Input
                    type="text"
                    label="Prenom"
                    placeholder="Entrer le prenom du residant"
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
                    defaultValue={currentResidant?.prenom}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        prenom: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Select
                    type="text"
                    label="Profession/Type de Residant"
                    placeholder="Choisir le type de residant"
                    defaultValue={[currentResidant?.profession]}
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
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        profession: e.target.value,
                      })
                    }
                  >
                    <SelectItem key="ouvrier" value="ouvrier">
                      Ouvrier
                    </SelectItem>
                    <SelectItem key="cadre" value="cadre">
                      Cadre
                    </SelectItem>
                    <SelectItem key="agent" value="agent de maitrise">
                      Agent de maitrise
                    </SelectItem>
                  </Select>

                  <Select
                    type="text"
                    label="Amelioré"
                    placeholder="Oui / Non"
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
                    defaultValue={currentResidant?.ameliored}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        is_ameliore: e.target.value,
                      })
                    }
                  >
                    <SelectItem key="yes" value="yes">
                      Oui
                    </SelectItem>
                    <SelectItem key="no" value="no">
                      Non
                    </SelectItem>
                  </Select>
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  {/* telephone */}
                  <Input
                    type="text"
                    label="Téléphone"
                    placeholder="Entrer le téléphone"
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
                    defaultValue={currentResidant?.telephone}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        telephone: e.target.value,
                      })
                    }
                  />
                  {/* cin */}
                  <Input
                    type="text"
                    label="CIN"
                    placeholder="Entrer le CIN"
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
                    defaultValue={currentResidant?.cin}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        cin: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  {/* email */}
                  <Input
                    type="text"
                    label="Email"
                    placeholder="Entrer l'email"
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
                    defaultValue={currentResidant?.email}
                    onChange={(e) =>
                      setCurrentResidant({
                        ...currentResidant,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
              <Button
                  color="danger"
                  variant="light"
                  className="text-sm font-medium" onClick={onClose}>
                  Fermer
                </Button>
                <Button color="primary" onClick={handleEditResidant}>
                  Sauvegarder
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        size="sm"
        backdrop="blur"
        placement="center"
        isOpen={isDeleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        scrollBehavior="inside"
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
                {/* Check if currentResidant and nom are defined */}
                {currentResidant && currentResidant.nom && (
                  <Button
                    color="primary"
                    onClick={() => {
                      console.log("Current Residant:", currentResidant);
                      if (currentResidant && currentResidant.nom) {
                        handleDeleteResidant(currentResidant.nom);
                      } else {
                        console.error(
                          "Invalid Residant ID for deletion:",
                          currentResidant?.nom
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

ResidantTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      res_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      nom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      prenom: PropTypes.string.isRequired,
      cin: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      telephone: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      profession: PropTypes.string.isRequired,
      ameliored: PropTypes.string,
      actions: PropTypes.string,
    })
  ).isRequired,
  title: PropTypes.string,
};

export default ResidantTable;
