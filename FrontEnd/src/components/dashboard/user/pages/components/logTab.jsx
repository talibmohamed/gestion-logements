import React, { useState } from "react";
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

const LogTable = ({ title }) => {
  const navigate = useNavigate();

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

  const {
    isOpen: isEquipModalOpen,
    onOpen: openEquipModal,
    onOpenChange: setEquipModalOpen,
  } = useDisclosure();
  const {
    isOpen: isDetailModalOpen,
    onOpen: openDetailModal,
    onOpenChange: setDetailModalOpen,
  } = useDisclosure();
  const {
    isOpen: isPlanModalOpen,
    onOpen: openPlanModal,
    onOpenChange: setPlanModalOpen,
  } = useDisclosure();

  const [currentEquipments, setCurrentEquipments] = useState([]);
  const [currentLogement, setCurrentLogement] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const renderSvgIcon = (equipment) => {
    const SvgComponent = IconMappings[equipment];
    return SvgComponent ? <SvgComponent className="inline-block mr-2" /> : null;
  };

  const getEquip = (user) => {
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
    openEquipModal();
  };

  const getLogementImage = (user) => {
    const typeLog = user.type_log.toLowerCase().trim();
    const ameliored = user.ameliored.toLowerCase().trim();
    const imageUrls = {
      cadre: {
        oui: "/planImages/cadreA.jfif",
        non: "/planImages/cadreNa.jpg",
      },
      "agent de maitrise": {
        oui: "/planImages/agentA.jfif",
        non: "/planImages/agentNa.jfif",
      },
      ouvrier: {
        oui: "/planImages/ouvrierA.jfif",
        non: "/planImages/ouvrierNa.jfif",
      },
    };

    return imageUrls[typeLog]?.[ameliored] || [];
  };

  const handleDetailIconClick = (logement) => {
    setCurrentLogement(logement);
    openDetailModal();
  };
  const handlePlanVoirPlusClick = (user) => {
    const imageUrl = getLogementImage(user);
    setCurrentImage(imageUrl);
    openPlanModal();
  };

  return (
    <>
      <div className="flex flex-col ml-4 mt-2 mb-6">
        <h2>{title}</h2>
      </div>
      <div className="gap-7 grid grid-cols-2 mx-4 sm:grid-cols-4">
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
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
            <Button variant="bordered" color="primary" onPress={openPlanModal}>
              Voir plus
            </Button>
            <Modal isOpen={isPlanModalOpen} onOpenChange={setPlanModalOpen}>
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
                    variant="bordered"
                    color="primary"
                    onPress={() => handlePlanVoirPlusClick(currentUser)}
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
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
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
            <Button variant="bordered" color="primary" onPress={openEquipModal}>
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
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold">Détails sur logement</h3>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-lg text-justify font-normal mx-2.5">
              Consultez les informations clés sur votre logement, telles que la
              superficie et le quota d'électricité, pour mieux gérer vos
              ressources.
            </p>
          </CardBody>
          <Divider />
          <CardFooter>
            <Button
              variant="bordered"
              color="primary"
              onPress={openDetailModal}
            >
              Voir plus
            </Button>
            <Modal
              size="lg"
              isOpen={isDetailModalOpen}
              onOpenChange={setDetailModalOpen}
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
                      <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                        <Input
                          type="text"
                          label="Profession/Type de Logement"
                          placeholder="Choisir le type de logement"
                          defaultValue={currentLogement?.type_log}
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
                          onChange={(e) =>
                            setCurrentLogement({
                              ...currentLogement,
                              type_log: e.target.value,
                            })
                          }
                        ></Input>

                        <Input
                          type="text"
                          label="Amelioré"
                          placeholder="Oui / Non"
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
                          defaultValue={currentLogement?.ameliored}
                          onChange={(e) =>
                            setCurrentLogement({
                              ...currentLogement,
                              ameliored: e.target.value,
                            })
                          }
                        ></Input>
                      </div>

                      <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                        <Input
                          type="text"
                          label="Nombre de pièces"
                          placeholder="Entrer le nombre de pièces"
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
                              <span className="text-default-400 text-small">
                                m²
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
                          defaultValue={currentLogement?.mc}
                          onChange={(e) =>
                            setCurrentLogement({
                              ...currentLogement,
                              mc: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center gap-4">
                        <Input
                          type="text"
                          label="Quota d'électricité"
                          className="max-w-sm"
                          endContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                kWh
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
                          label="Quota d'eau"
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
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </CardFooter>
        </Card>

        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold">Réclamation</h3>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-lg text-justify font-normal mx-2.5">
              Signalez tout problème ou faites une réclamation concernant votre
              logement en toute simplicité.
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
    </>
  );
};

LogTable.propTypes = {
  title: PropTypes.string.isRequired,
};

export default LogTable;
