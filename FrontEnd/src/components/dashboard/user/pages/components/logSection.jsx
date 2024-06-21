import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import { IconMappings } from "./svgMappings.jsx";
import { useNavigate } from "react-router-dom";
import mockData from "./mockData.jsx";
import cadreAImage from "../planImages/cadreA.jfif";
import cadreNaImage from "../planImages/cadreNa.jpg";
import agentAImage from "../planImages/agentA.jfif";
import agentNaImage from "../planImages/agentNa.jfif";
import ouvrierAImage from "../planImages/ouvrierA.jfif";
import ouvrierNaImage from "../planImages/ouvrierNa.jfif";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const imageMappings = {
  cadre: {
    oui: cadreAImage,
    non: cadreNaImage,
  },
  "agent de maitrise": {
    oui: agentAImage,
    non: agentNaImage,
  },
  ouvrier: {
    oui: ouvrierAImage,
    non: ouvrierNaImage,
  },
};

const LogSection = ({ title }) => {
  const navigate = useNavigate();
  const [user] = useState(mockData); // Use mock data directly
  const [currentImage, setCurrentImage] = useState(null);
  const [isPlanModalOpen, setPlanModalOpen] = useState(false);
  const [currentEquipments, setCurrentEquipments] = useState([]);
  const [currentLogement, setCurrentLogement] = useState(null);

  const EquipmentSection = ({ title, equipments }) => (
    <div className="border-b border-[#3f3f46]">
      <h3 className="text-lg font-semibold my-4">{title}</h3>
      <div className="flex flex-col font-normal gap-4 mb-8">
        {equipments.map((equipment) => (
          <div key={equipment} className="flex items-center">
            {renderSvgIcon(equipment)}
            <span>{equipment}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const { isOpen: isEquipModalOpen, onOpenChange: setEquipModalOpen } =
    useDisclosure();
  const {
    isOpen: isDetailModalOpen,
    onOpen: openDetailModal,
    onOpenChange: setDetailModalOpen,
  } = useDisclosure();

  const renderSvgIcon = (equipment) => {
    const SvgComponent = IconMappings[equipment];
    return SvgComponent ? <SvgComponent className="inline-block mr-2" /> : null;
  };

  const handleEquipmentsClick = (user) => {
    const typeLog = user.type_log.toLowerCase().trim();
    const ameliored = user.ameliored.toLowerCase().trim();
    const equipmentData = {
      cadre: {
        oui: [
          "Baignoire",
          "Douche",
          "Climatisation central",
          "Chauffage central",
          "Lave-linge",
          "Sèche-linge",
          "Espaces de rangement (placards intégrés, dressing)",
          "Réfrigérateur",
          "Four à micro-ondes",
          "Cuisinière électrique",
          "Lave-vaisselle",
          "Four",
          "Balcon ou terasse spacieux",
          "Jardins privés ou espaces verts personnels",
          "Place de parking dédiée avec point de recharge pour véhicules électriques",
          "Accès à des équipements de fitness en plein air",
          "Wifi",
          "Système de sécurité",
        ],
        non: [
          "Douche",
          "Four",
          "Réfrigérateur",
          "Four à micro-ondes",
          "Cuisinière électrique",
          "Chauffage électrique",
          "Espaces de rangement basiques",
          "Lave-linge",
          "Petit balcon",
          "Accès à un parking commun",
          "Wifi",
          "Système de sécurité",
        ],
      },
      "agent de maitrise": {
        oui: [
          "Douche",
          "Chauffage central",
          "Lave-linge",
          "Espaces de rangement suffisants",
          "Réfrigérateur",
          "Cuisinière électrique",
          "Balcon",
          "Place de parking partagée",
          "Espaces verts communs",
          "Wifi",
          "Système de sécurité",
        ],
        non: [
          "Douche",
          "Réfrigérateur",
          "Cuisinière à gaz",
          "Chauffage au gaz",
          "Rangement minimal",
          "Accès à un parking commun",
          "Wifi",
          "Système de sécurité",
          "Pas de balcon",
        ],
      },
      ouvrier: {
        oui: [
          "Douche",
          "Chauffage électrique",
          "Espaces de rangement suffisants",
          "Réfrigérateur",
          "Cuisinière à gaz",
          "Petit balcon",
          "Espaces verts partagés",
          "Parking commun",
          "Wifi",
          "Système de sécurité",
        ],
        non: [
          "Douche",
          "Chauffage au gaz",
          "Réfrigérateur",
          "Cuisinière à gaz",
          "Rangement minimal",
          "Accès à un parking commun",
          "Système de sécurité",
          "Wifi",
          "Pas de balcon",
        ],
      },
    };
    const userEquipments = equipmentData[typeLog]?.[ameliored] || [];
    setCurrentEquipments(userEquipments);
    setEquipModalOpen(true);
  };
  const handleDetailClick = (logement) => {
    setCurrentLogement(logement);
    openDetailModal();
  };
  const handleOpenModal = () => {
    const selectedImage =
      imageMappings[user.type_log.toLowerCase()][user.ameliored.toLowerCase()];
    setCurrentImage(selectedImage);
    setPlanModalOpen(true);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col ml-4 mt-2 mb-6">
        <h2>{title}</h2>
      </div>
      {isMobile ? (
        <Carousel showArrows={false} showStatus={false} showThumbs={false}>
          <div className="flex flex-row justify-center">
            <Card className="max-w-[400px] mb-12" shadow="none">
              <CardHeader className="flex gap-3">
                <TipsAndUpdatesOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold">Plan du logement</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-lg font-normal mx-3">
                  Visualisez le plan détaillé de votre logement pour une
                  meilleure compréhension de la disposition des pièces et des
                  espaces
                </p>
              </CardBody>
              <Divider />
              <CardFooter>
                <Button
                  variant="flat"
                  color="default"
                  onPress={handleOpenModal}
                >
                  Voir plus
                </Button>
                <Modal
                  isOpen={isPlanModalOpen}
                  onClose={() => setPlanModalOpen(false)}
                  classNames={{
                    base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                  }}
                >
                  <ModalContent>
                    <ModalHeader>Plan du logement</ModalHeader>
                    <ModalBody>
                      <Image
                        src={currentImage}
                        alt="Plan du logement"
                        width="100%"
                        height="auto"
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="danger"
                        variant="light"
                        className="text-sm font-medium"
                        onPress={() => setPlanModalOpen(false)}
                      >
                        Fermer
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </CardFooter>
            </Card>
          </div>
          <div className="flex flex-row justify-center">
            <Card className="max-w-[400px]"shadow="none">
              <CardHeader className="flex gap-3">
                <AutoFixHighOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold">Equipement</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-lg font-normal mx-2.5">
                  Découvrez les équipements disponibles dans votre logement pour
                  faciliter votre quotidien et votre confort.
                </p>
              </CardBody>
              <Divider />
              <CardFooter>
                <Button
                  variant="bordered"
                  color="primary"
                  onPress={() => handleEquipmentsClick(user)}
                >
                  Voir plus
                </Button>
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
                          Equipement Details
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
              </CardFooter>
            </Card>
          </div>
          <div className="flex flex-row justify-center">
            <Card className="max-w-[400px]"shadow="none">
              <CardHeader className="flex gap-3">
                <SettingsSuggestOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold">
                    Détails sur logement
                  </h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-lg font-normal mx-2">
                  Consultez les informations clés sur votre logement, telles que
                  la superficie et le quota d'électricité, pour mieux gérer vos
                  ressources.
                </p>
              </CardBody>
              <Divider />
              <CardFooter>
                <Button
                  variant="bordered"
                  color="primary"
                  onPress={() => handleDetailClick(user)}
                >
                  Voir plus
                </Button>
                <Modal
                  size="lg"
                  isOpen={isDetailModalOpen}
                  onClose={() => setDetailModalOpen(false)}
                  classNames={{
                    base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                  }}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Détails sur le logement
                        </ModalHeader>
                        <ModalBody>
                          {currentLogement && (
                            <>
                              <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                                <Input
                                  label="Profession/Type de Logement"
                                  readOnly
                                  value={currentLogement.type_log || ""}
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
                                      "group-data-[hover=true]:bg-zinc-700",
                                      "group-data-[focus=true]:bg-zinc-800 ",
                                      "!cursor-text",
                                    ],
                                  }}
                                />
                                <Input
                                  type="text"
                                  label="Amélioré"
                                  readOnly
                                  value={currentLogement.ameliored || ""}
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
                                      "group-data-[hover=true]:bg-zinc-700",
                                      "group-data-[focus=true]:bg-zinc-800 ",
                                      "!cursor-text",
                                    ],
                                  }}
                                />
                              </div>
                              <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                                <Input
                                  type="text"
                                  label="Nombre de pièces"
                                  readOnly
                                  value={currentLogement.nbr_piece || ""}
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
                                      "group-data-[hover=true]:bg-zinc-700",
                                      "group-data-[focus=true]:bg-zinc-800 ",
                                      "!cursor-text",
                                    ],
                                  }}
                                />
                                <Input
                                  type="text"
                                  label="Superficie"
                                  readOnly
                                  value={currentLogement.mc || ""}
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
                                      "group-data-[hover=true]:bg-zinc-700",
                                      "group-data-[focus=true]:bg-zinc-800 ",
                                      "!cursor-text",
                                    ],
                                  }}
                                />
                              </div>
                              <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                                <Input
                                  type="text"
                                  label="Quota d'électricité"
                                  readOnly
                                  value={currentLogement.quotaE || ""}
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
                                      "group-data-[hover=true]:bg-zinc-700",
                                      "group-data-[focus=true]:bg-zinc-800 ",
                                      "!cursor-text",
                                    ],
                                  }}
                                />
                                <Input
                                  type="text"
                                  label="Quota d'eau"
                                  endContent={
                                    <div className="pointer-events-none flex items-center">
                                      <span className="text-default-400 text-small">
                                        m³
                                      </span>
                                    </div>
                                  }
                                  readOnly
                                  value={currentLogement.quotaW || ""}
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
                                      "group-data-[hover=true]:bg-zinc-700",
                                      "group-data-[focus=true]:bg-zinc-800 ",
                                      "!cursor-text",
                                    ],
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="flat"
                            onClick={onClose}
                          >
                            Fermer
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </CardFooter>
            </Card>
          </div>
          <div className="flex flex-row justify-center">
            <Card className="max-w-[400px]"shadow="none">
              <CardHeader className="flex gap-3">
                <FlagOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold">Réclamation</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-lg font-normal mx-2.5">
                  Signalez tout problème ou faites une réclamation concernant
                  votre logement en toute simplicité.
                </p>
              </CardBody>
              <Divider />
              <CardFooter>
                <Button
                  variant="bordered"
                  color="primary"
                  onClick={() => navigate("/dashboard/reclamation")}
                >
                  Voir plus
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Carousel>
      ) : (
        <div className="gap-7 grid grid-cols-2 mx-4 sm:grid-cols-4">
          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <TipsAndUpdatesOutlinedIcon />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">Plan du logement</h3>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-lg text-justify font-normal mx-2.5">
                Visualisez le plan détaillé de votre logement pour une meilleure
                compréhension de la disposition des pièces et des espaces
              </p>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button variant="flat" color="default" onPress={handleOpenModal}>
                Voir plus
              </Button>
              <Modal
                isOpen={isPlanModalOpen}
                onClose={() => setPlanModalOpen(false)}
                classNames={{
                  base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
                  closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
              >
                <ModalContent>
                  <ModalHeader>Plan du logement</ModalHeader>
                  <ModalBody>
                    <Image
                      src={currentImage}
                      alt="Plan du logement"
                      width="100%"
                      height="auto"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="light"
                      className="text-sm font-medium"
                      onPress={() => setPlanModalOpen(false)}
                    >
                      Fermer
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </CardFooter>
          </Card>

          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <AutoFixHighOutlinedIcon />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">Equipement</h3>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-lg text-justify font-normal mx-2.5">
                Découvrez les équipements disponibles dans votre logement pour
                faciliter votre quotidien et votre confort.
              </p>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                variant="bordered"
                color="primary"
                onPress={() => handleEquipmentsClick(user)}
              >
                Voir plus
              </Button>
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
                        Equipement Details
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
            </CardFooter>
          </Card>

          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <SettingsSuggestOutlinedIcon />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">Détails sur logement</h3>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-lg text-justify font-normal mx-2.5">
                Consultez les informations clés sur votre logement, telles que
                la superficie et le quota d'électricité, pour mieux gérer vos
                ressources.
              </p>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                variant="bordered"
                color="primary"
                onPress={() => handleDetailClick(user)}
              >
                Voir plus
              </Button>
              <Modal
                size="lg"
                isOpen={isDetailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                classNames={{
                  base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
                  closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Détails sur le logement
                      </ModalHeader>
                      <ModalBody>
                        {currentLogement && (
                          <>
                            <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                              <Input
                                label="Profession/Type de Logement"
                                readOnly
                                value={currentLogement.type_log || ""}
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
                                    "group-data-[hover=true]:bg-zinc-700",
                                    "group-data-[focus=true]:bg-zinc-800 ",
                                    "!cursor-text",
                                  ],
                                }}
                              />
                              <Input
                                type="text"
                                label="Amélioré"
                                readOnly
                                value={currentLogement.ameliored || ""}
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
                                    "group-data-[hover=true]:bg-zinc-700",
                                    "group-data-[focus=true]:bg-zinc-800 ",
                                    "!cursor-text",
                                  ],
                                }}
                              />
                            </div>
                            <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                              <Input
                                type="text"
                                label="Nombre de pièces"
                                readOnly
                                value={currentLogement.nbr_piece || ""}
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
                                    "group-data-[hover=true]:bg-zinc-700",
                                    "group-data-[focus=true]:bg-zinc-800 ",
                                    "!cursor-text",
                                  ],
                                }}
                              />
                              <Input
                                type="text"
                                label="Superficie"
                                readOnly
                                value={currentLogement.mc || ""}
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
                                    "group-data-[hover=true]:bg-zinc-700",
                                    "group-data-[focus=true]:bg-zinc-800 ",
                                    "!cursor-text",
                                  ],
                                }}
                              />
                            </div>
                            <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                              <Input
                                type="text"
                                label="Quota d'électricité"
                                readOnly
                                value={currentLogement.quotaE || ""}
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
                                    "group-data-[hover=true]:bg-zinc-700",
                                    "group-data-[focus=true]:bg-zinc-800 ",
                                    "!cursor-text",
                                  ],
                                }}
                              />
                              <Input
                                type="text"
                                label="Quota d'eau"
                                endContent={
                                  <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">
                                      m³
                                    </span>
                                  </div>
                                }
                                readOnly
                                value={currentLogement.quotaW || ""}
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
                                    "group-data-[hover=true]:bg-zinc-700",
                                    "group-data-[focus=true]:bg-zinc-800 ",
                                    "!cursor-text",
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
            </CardFooter>
          </Card>

          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <FlagOutlinedIcon />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">Réclamation</h3>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-lg text-justify font-normal mx-2.5">
                Signalez tout problème ou faites une réclamation concernant
                votre logement en toute simplicité.
              </p>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                variant="bordered"
                color="primary"
                onClick={() => navigate("/dashboard/reclamation")}
              >
                Voir plus
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

LogSection.propTypes = {
  title: PropTypes.string.isRequired,
};

export default LogSection;
