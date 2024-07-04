import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchLogementThunk } from "../../../../../session/thunks/userthunks.jsx";

const imageMappings = {
  cadre: {
    true: cadreAImage,
    false: cadreNaImage,
  },
  "agent de maitrise": {
    true: agentAImage,
    false: agentNaImage,
  },
  ouvrier: {
    true: ouvrierAImage,
    false: ouvrierNaImage,
  },
};

const LogSection = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Call fetchLogementThunk
  useEffect(() => {
    console.log("fetching");
    dispatch(fetchLogementThunk());
  }, [dispatch]);

  // Get logement from state
  const logement = useSelector((state) => state.logements.logements);
  console.log(logement);

  const user = logement && logement.length > 0 ? logement[0] : {};
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

  const handleDetailClick = (logement) => {
    setCurrentLogement(logement);
    openDetailModal();
  };
  const handleOpenModal = () => {
    const selectedImage =
      imageMappings[user.typelog.toLowerCase()][user.is_ameliore.toString()];
    setCurrentImage(selectedImage);
    setPlanModalOpen(true);
  };

  const handleEquipmentsClick = (logement) => {
    setCurrentEquipments(logement.equipment_names);
    setEquipModalOpen(true);
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
      <div
        className="gap-7 grid"
        style={{
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        <Card
          className={`max-w-full bg-[#171821] bg-opacity-10 backdrop-blur-sm`}
        >
          <CardHeader className="flex gap-3">
            <TipsAndUpdatesOutlinedIcon sx={{ color: "#ff8906" }} />
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-[#fffffe]">
                Plan du logement
              </h3>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-lg text-pretty font-normal mx-2.5 text-[#fff3ec]">
              Visualisez le plan détaillé de votre logement pour une meilleure
              compréhension de la disposition des pièces et des espaces.
            </p>
          </CardBody>
          <Divider />
          <CardFooter className="flex flex-row-reverse">
            <Button variant="light" color="danger" onPress={handleOpenModal}>
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

        <Card
          className={`max-w-full bg-[#171821] bg-opacity-10 backdrop-blur-sm`}
        >
          <CardHeader className="flex gap-3 ">
            <AutoFixHighOutlinedIcon sx={{ color: "#ff8906" }} />
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-[#fffffe]">
                Equipement
              </h3>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-lg text-pretty font-normal mx-2.5 text-[#fff3ec]">
              Découvrez les équipements disponibles dans votre logement pour
              faciliter votre quotidien et votre confort.
            </p>
          </CardBody>
          <Divider />
          <CardFooter className="flex flex-row-reverse">
            <Button
              variant="light"
              color="danger"
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

        <Card
          className={`max-w-full bg-[#171821] bg-opacity-10 backdrop-blur-sm`}
        >
          <CardHeader className="flex gap-3">
            <SettingsSuggestOutlinedIcon sx={{ color: "#ff8906" }} />
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-[#fffffe]">
                Détails sur logement
              </h3>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-lg text-pretty font-normal mx-2.5 text-[#fff3ec]">
              Consultez les informations clés sur votre logement, telles que la
              superficie et le quota d'électricité, pour mieux gérer vos
              ressources.
            </p>
          </CardBody>
          <Divider />
          <CardFooter className="flex flex-row-reverse">
            <Button
              variant="light"
              color="danger"
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
                              value={currentLogement.typelog || ""}
                              className={`max-w-sm ${isMobile ? "w-full" : ""}`}
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
                              value={
                                currentLogement.is_ameliore ? "Oui" : "Non"
                              }
                              className={`max-w-sm ${isMobile ? "w-full" : ""}`}
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
                              value={currentLogement.piece || ""}
                              className={`max-w-sm ${isMobile ? "w-full" : ""}`}
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
                              className={`max-w-sm ${isMobile ? "w-full" : ""}`}
                              endContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-default-400 text-small">
                                    m^2
                                  </span>
                                </div>
                              }
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
                              value={currentLogement.quotas_electricite || ""}
                              endContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-default-400 text-small">
                                    kWh
                                  </span>
                                </div>
                              }
                              className={`max-w-sm ${isMobile ? "w-full" : ""}`}
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
                              value={currentLogement.quotas_eau || ""}
                              className={`max-w-sm ${isMobile ? "w-full" : ""}`}
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

        <Card
          className={`max-w-full bg-[#171821] bg-opacity-10 backdrop-blur-sm`}
        >
          <CardHeader className="flex gap-3">
            <FlagOutlinedIcon sx={{ color: "#ff8906" }} />
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-[#fffffe]">
                Réclamation
              </h3>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-lg text-pretty font-normal mx-2.5 text-[#fff3ec]">
              Signalez tout problème ou faites une réclamation concernant votre
              logement en toute simplicité.
            </p>
          </CardBody>
          <Divider />
          <CardFooter className="flex flex-row-reverse">
            <Button
              variant="light"
              color="danger"
              onClick={() => navigate("/dashboard/reclamation")}
            >
              Voir plus
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

LogSection.propTypes = {
  title: PropTypes.string.isRequired,
};

export default LogSection;
