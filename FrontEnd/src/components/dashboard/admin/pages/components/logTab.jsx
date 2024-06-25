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
import { IconMappings } from "./svgMappings.jsx";

console.log();

const INITIAL_VISIBLE_COLUMNS = [
  "num_de_log",
  "nom",
  "type_log",
  "ameliored",
  "mc",
  "address",
  "quotaE",
  "quotaW",
  "equip",
  "actions",
];

const SMALL_DEVICE_COLUMNS = [
  "num_de_log",
  "nom",
  "type",
  "ameliored",
  "actions",
];

const LogTable = ({ columns, rows, title }) => {
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
    isOpen: isEquipModalOpen,
    onOpen: openEquipModal,
    onOpenChange: setEquipModalOpen,
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
    isOpen: isDetails2ModalOpen,
    onOpen: openDetails2Modal,
    onOpenChange: setDetails2ModalOpen,
  } = useDisclosure();

  const [currentLogement, setCurrentLogement] = useState(null);
  const [currentEquipments, setCurrentEquipments] = useState([]);

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

  const handleDotsIconClick = (logement) => {
    setCurrentLogement(logement);
  };

  const handleDetails2IconClick = (logement) => {
    setCurrentLogement(logement);
    openDetails2Modal(true);
  };

  const handleEditIconClick = (logement) => {
    setCurrentLogement(logement);
    openEditModal();
  };

  const handleDeleteIconClick = (logement) => {
    setCurrentLogement(logement);
    openDeleteModal();
  };

  const handleDetailsIconClick = (equipmentNames) => {
    setCurrentEquipments(equipmentNames);
    openEquipModal();
  };

  const renderSvgIcon = (equipment) => {
    const SvgComponent = IconMappings[equipment];
    return SvgComponent ? <SvgComponent className="inline-block mr-2" /> : null;
  };

  // add new logement 
  const [newLogement, setNewLogement] = useState({
    no_logement: "",
    occupe_par: "",
    type_log: "",
    ameliore: "",
    nb_pieces: "",
    superficie: "",
  });

  const handleAddLogement = () => {
    //test if new logement empty dont call displach 
    if (
      newLogement.no_logement === "" ||
      newLogement.occupe_par === "" ||
      newLogement.type_log === "" ||
      newLogement.ameliore === "" ||
      newLogement.nb_pieces === "" ||
      newLogement.superficie === ""
    ) {
      return;
    }
    dispatch(addLogementThunk(newLogement));
    setAddModalOpen(false);
  };


  const renderCell = React.useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "equip":
          return (
            <div className="flex items-center">
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
                  onClick={() => handleDetailsIconClick(item.equipment_names)}
                  >
                  <EyeIcon />
                </span>
              </Tooltip>
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
                      if (key === "details") handleDetails2IconClick(item);
                      if (key === "equip") handleDetailsIconClick(item);
                      if (key === "edit") handleEditIconClick(item);
                      if (key === "delete") handleDeleteIconClick(item);
                    }}
                  >
                    <DropdownItem key="details" startContent={<Eye2Icon />}>
                      Détails
                    </DropdownItem>

                    <DropdownItem
                      key="equip"
                      startContent={
                        <TipsAndUpdatesOutlinedIcon sx={{ fontSize: 16 }} />
                      }
                    >
                      Les équipements disponibles
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

  const EquipmentSection = ({ title, equipments }) => (
    <div className=" border-b border-[#3f3f46]">
      <h3 className="text-lg font-semibold my-4">{title}</h3>
      <div className="flex flex-col font-normal gap-4 mb-8">
        {equipments.map((equipment) => (
          <div key={equipment} className="flex items-center ">
            {renderSvgIcon(equipment)}
            <span>{equipment}</span>
          </div>
        ))}
      </div>
    </div>
  );

  console.log(rows);
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
                Ajouter Un Logement
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4 ">
                  <Input
                    type="text"
                    label="No logement"
                    placeholder="Entrer le no du logement"
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
                  />
                  <Input
                    isDisabled
                    type="text"
                    label="Occupé Par"
                    className="max-w-sm"
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
                  />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Select
                    type="text"
                    label="Profession/Type de Logement"
                    placeholder="Choisir le type de logement"
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
                    defaultValue={currentLogement?.type_log}
                    onChange={(e) =>
                      setCurrentLogement({
                        ...currentLogement,
                        type_log: e.target.value,
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
                      Agent de maitrise
                    </SelectItem>
                  </Select>

                  <Select
                    type="text"
                    label="Amelioré"
                    placeholder="Choisir le type de logement"
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
                    defaultValue={currentLogement?.type_log}
                    onChange={(e) =>
                      setCurrentLogement({
                        ...currentLogement,
                        type_log: e.target.value,
                      })
                    }
                  >
                    <SelectItem key="ouvrier" value="ouvrier">
                      Oui
                    </SelectItem>
                    <SelectItem key="cadre" value="cadre">
                      Non
                    </SelectItem>
                  </Select>
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Input
                    type="text"
                    label="Nombre de pièces"
                    placeholder="Entrer le nombre de pièces"
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
                  />
                  <Input
                    type="text"
                    label="Superficie"
                    placeholder="Entrer la superficie"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">m²</span>
                      </div>
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
                        "bg-zinc-800",
                        "group-data-[hover=true]:bg-zinc-700",
                        "group-data-[focus=true]:bg-zinc-800 ",
                        "!cursor-text",
                      ],
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAddLogement}>
                  Enregistrer
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
                Modifier les détails du logement
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
                    defaultValue={currentLogement?.nom}
                    onChange={(e) =>
                      setCurrentLogement({
                        ...currentLogement,
                        nom: e.target.value,
                      })
                    }
                  />

                  <Input
                    type="text"
                    label="No du logement"
                    placeholder="Entrer No du logement"
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
                    defaultValue={currentLogement?.num_de_log}
                    onChange={(e) =>
                      setCurrentLogement({
                        ...currentLogement,
                        num_de_log: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Select
                    type="text"
                    label="Profession/Type de Logement"
                    placeholder="Choisir le type de logement"
                    defaultValue={currentLogement?.type_log}
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
                      setCurrentLogement({
                        ...currentLogement,
                        type_log: e.target.value,
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
                    defaultValue={currentLogement?.ameliored}
                    onChange={(e) =>
                      setCurrentLogement({
                        ...currentLogement,
                        ameliored: e.target.value,
                      })
                    }
                  >
                    <SelectItem key="ouvrier" value="ouvrier">
                      Oui
                    </SelectItem>
                    <SelectItem key="cadre" value="cadre">
                      Non
                    </SelectItem>
                  </Select>
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                  <Input
                    type="text"
                    label="Nombre de pièces"
                    placeholder="Entrer le nombre de pièces"
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
                    defaultValue={currentLogement?.piece}
                    onChange={(e) =>
                      setCurrentLogement({
                        ...currentLogement,
                        piece: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="text"
                    label="Superficie"
                    placeholder="Entrer la superficie"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">m²</span>
                      </div>
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
                        "bg-zinc-800",
                        "group-data-[hover=true]:bg-zinc-700",
                        "group-data-[focus=true]:bg-zinc-800 ",
                        "!cursor-text",
                      ],
                    }}
                    defaultValue={currentLogement?.mc}
                    onChange={(e) =>
                      setCurrentLogement({
                        ...currentLogement,
                        mc: e.target.value,
                      })
                    }
                  />
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
        size="2xl"
        backdrop="opaque"
        isOpen={isEquipModalOpen}
        onOpenChange={setEquipModalOpen}
        scrollBehavior="inside"
        classNames={{
          base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl">
                Les équipements disponibles
              </ModalHeader>
              <ModalBody>
                <EquipmentSection
                  title="Salle de bain"
                  equipments={currentEquipments.filter((equip) =>
                    ["Baignoire", "Douche"].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Chambre"
                  equipments={currentEquipments.filter((equip) =>
                    [
                      "Lave-linge",
                      "Sèche-linge",
                      "Espaces de rangement (placards intégrés, dressing)",
                      "Espaces de rangement suffisants",
                      "Rangement minimal",
                    ].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Cuisine"
                  equipments={currentEquipments.filter((equip) =>
                    [
                      "Lave-vaisselle",
                      "Four",
                      "Réfrigérateur",
                      "Cuisinière électrique",
                      "Cuisinière à gaz",
                      "Four à micro-ondes",
                    ].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Chauffage et climatisation"
                  equipments={currentEquipments.filter((equip) =>
                    [
                      "Climatisation central",
                      "Chauffage central",
                      "Chauffage électrique",
                      "Chauffage au gaz",
                    ].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Extérieur"
                  equipments={currentEquipments.filter((equip) =>
                    [
                      "Pas de balcon",
                      "Balcon",
                      "Balcon ou terasse spacieux",
                      "Petit balcon",
                      "Jardins privés ou espaces verts personnels",
                      "Espaces verts communs",
                    ].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Services"
                  equipments={currentEquipments.filter((equip) =>
                    ["Wifi", "Système de sécurité"].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Parking et installations"
                  equipments={currentEquipments.filter((equip) =>
                    [
                      "Parking commun",
                      "Place de parking partagée",
                      "Accès à un parking commun",
                      "Place de parking dédiée avec point de recharge pour véhicules électriques",
                      "Accès à des équipements de fitness en plein air",
                    ].includes(equip)
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  className="text-sm font-medium"
                  onPress={onClose}
                >
                  Fermer
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
                <Button color="primary">Continuer</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        size="lg"
        isOpen={isDetails2ModalOpen}
        onOpenChange={setDetails2ModalOpen}
        classNames={{
          base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl">Détails du logement</ModalHeader>
              <ModalBody>
                <Input
                  isReadOnly
                  type="text"
                  label="Résidant:"
                  variant="bordered"
                  defaultValue={currentLogement.id_res}
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
                  label="Profession/Type de logement:"
                  variant="bordered"
                  defaultValue={currentLogement.type_log}
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
                  label="Amélioré:"
                  variant="bordered"
                  defaultValue={currentLogement.ameliored ? "Oui" : "Non"}
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
                  label="Superficie:"
                  variant="bordered"
                  defaultValue={currentLogement.mc}
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
                  label="Quotas d'électricité:"
                  variant="bordered"
                  defaultValue={currentLogement.quotaE}
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
                  label="Quotas d'eau:"
                  variant="bordered"
                  defaultValue={currentLogement.quotaW}
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
                <Button
                  color="danger"
                  variant="light"
                  className="text-sm font-medium"
                  onPress={onClose}
                >
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

LogTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      num_de_log: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      nom: PropTypes.string.isRequired,
      type_log: PropTypes.string.isRequired,
      ameliored: PropTypes.string,
      equip: PropTypes.arrayOf(PropTypes.string),
      actions: PropTypes.string,
    })
  ).isRequired,
  title: PropTypes.string,
};

export default LogTable;
