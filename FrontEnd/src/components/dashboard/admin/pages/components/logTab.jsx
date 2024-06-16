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
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { SearchIcon } from "../Icons/SearchIcon";
import { EditIcon } from "../Icons/EditIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import PropTypes from "prop-types";
import { IconMappings } from "./svgMappings.jsx";

const INITIAL_VISIBLE_COLUMNS = [
  "id_res",
  "num_de_log",
  "nom",
  "type_log",
  "ameliored",
  "equip",
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
    onClose: closeAddModal,
    onOpenChange: setAddModalOpen,
  } = useDisclosure();
  const {
    isOpen: isEquipModalOpen,
    onOpen: openEquipModal,
    onClose: closeEquipModal,
    onOpenChange: setEquipModalOpen,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
    onOpenChange: setEditModalOpen,
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

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...rows];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nom.toLowerCase().includes(filterValue.toLowerCase())
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

  const handleEditIconClick = (logement) => {
    setCurrentLogement(logement);
    openEditModal();
  };

  const handleEyeIconClick = (user) => {
    const typeLog = user.type_log.toLowerCase().trim();
    const ameliored = user.ameliored.toLowerCase().trim();
    const equipmentData = {
      cadre: {
        oui: [
          "baignoire",
          "douche",
          "clim",
          "heating",
          "closet",
          "dishwasher",
          "four",
          "refrigerateur",
          "stove",
          "microwave",
          "balcon",
          "jardin",
          "parking",
          "terasse",
        ],
        non: [
          "douche",
          "four",
          "refrigerateur",
          "stove",
          "microwave",
          "heating",
          "closet",
          "parking",
        ],
      },
      ouvrier: {
        oui: [
          "douche",
          "clim",
          "heating",
          "closet",
          "refrigerateur",
          "stove",
          "microwave",
          "balcon",
          "jardin",
          "parking",
        ],
        non: ["douche","refrigerateur", "stove", "heating", "closet", "parking"],
      },
      "agent de maitrise": {
        oui: [
          "douche",
          "heating",
          "closet",
          "refrigerateur",
          "stove",
          "balcon",
          "jardin",
          "parking",
        ],
        non: ["refrigerateur", "stove", "heating", "closet", "parking"],
      },
    };
    const userEquipments = equipmentData[typeLog]?.[ameliored] || [];
    setCurrentEquipments(userEquipments);
    openEquipModal();
  };

  const handleSave = () => {
    // to handle saving the updated data
    console.log("Updated Logement:", currentLogement);
    setEditModalOpen(false);
  };

  const renderSvgIcon = (equipment) => {
    const SvgComponent = IconMappings[equipment];
    return SvgComponent ? <SvgComponent className="inline-block mr-2" /> : null;
  };

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "equip":
        return (
          <div className="flex items-center">
            <Tooltip content="Details">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEyeIconClick(user)}
              >
                <EyeIcon />
              </span>
            </Tooltip>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Modifier">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEditIconClick(user)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" variant="light" content="Supprimer">
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
        {title && <h2 className=" table-title">{title}</h2>}
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              className="bg-foreground text-background"
              size="sm"
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
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 ">
                  <Input
                    type="text"
                    label="No logement"
                    placeholder="Entrer le no du logement"
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
                    label="Occupe Par"
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
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Select
                    type="text"
                    label="Profession/Type de Logement"
                    placeholder="Choisir le type de logement"
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
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
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
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

                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Select
                    type="text"
                    label="Profession/Type de Logement"
                    placeholder="Choisir le type de logement"
                    defaultValue={currentLogement?.type_log}
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
              <ModalHeader className="text-xl">Equipement Details</ModalHeader>
              <ModalBody>
                <EquipmentSection
                  title="Salle de bain"
                  equipments={currentEquipments.filter((equip) =>
                    ["baignoire", "douche"].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Chambre"
                  equipments={currentEquipments.filter((equip) =>
                    ["closet"].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Cuisine"
                  equipments={currentEquipments.filter((equip) =>
                    [
                      "dishwasher",
                      "four",
                      "refrigerateur",
                      "stove",
                      "microwave",
                    ].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Chauffage et climatisation"
                  equipments={currentEquipments.filter((equip) =>
                    ["clim", "heating"].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Extérieur"
                  equipments={currentEquipments.filter((equip) =>
                    ["balcon", "jardin", "terasse"].includes(equip)
                  )}
                />
                <EquipmentSection
                  title="Parking et installations"
                  equipments={currentEquipments.filter((equip) =>
                    ["station", "parking", "gym"].includes(equip)
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
