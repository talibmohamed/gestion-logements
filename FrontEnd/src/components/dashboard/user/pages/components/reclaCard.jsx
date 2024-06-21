import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import HomeRepairServiceOutlinedIcon from "@mui/icons-material/HomeRepairServiceOutlined";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import WaterDamageOutlinedIcon from "@mui/icons-material/WaterDamageOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ReclaCard = ({ title }) => {
  const {
    isOpen: isMaintenanceModalOpen,
    onOpen: openMaintenanceModal,
    onClose: closeMaintenanceModal,
  } = useDisclosure();

  const {
    isOpen: isInfestationModalOpen,
    onOpen: openInfestationModal,
    onClose: closeInfestationModal,
  } = useDisclosure();

  const {
    isOpen: isStructuralModalOpen,
    onOpen: openStructuralModal,
    onClose: closeStructuralModal,
  } = useDisclosure();

  const {
    isOpen: isEquipmentModalOpen,
    onOpen: openEquipmentModal,
    onClose: closeEquipmentModal,
  } = useDisclosure();

  const {
    isOpen: isMoistureModalOpen,
    onOpen: openMoistureModal,
    onClose: closeMoistureModal,
  } = useDisclosure();

  const {
    isOpen: isNeighborModalOpen,
    onOpen: openNeighborModal,
    onClose: closeNeighborModal,
  } = useDisclosure();

  const {
    isOpen: isAutreModalOpen,
    onOpen: openAutreModal,
    onClose: closeAutreModal,
  } = useDisclosure();

  const handleComplaintConfirmation = (complaintType) => {
    switch (complaintType) {
      case "Problèmes de maintenance":
        openMaintenanceModal();
        break;
      case "Infestations de parasites":
        openInfestationModal();
        break;
      case "Défauts structurels":
        openStructuralModal();
        break;
      case "Questions liées aux équipements fournis":
        openEquipmentModal();
        break;
      case "Problèmes d'humidité ou de moisissure":
        openMoistureModal();
        break;
      case "Problèmes de voisinage":
        openNeighborModal();
        break;
      case "Autres problèmes":
        openAutreModal();
      default:
        break;
    }
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
        <h1>{title}</h1>
      </div>
      {isMobile ? (
        <>
          <Carousel showArrows={false} showStatus={false} showThumbs={false}>
            <div className="flex flex-col mx-4 mb-9 gap-y-4 justify-center">
              <Card
                className="max-w-[400px]"
                isPressable
                onPress={() =>
                  handleComplaintConfirmation("Problèmes de maintenance")
                }
              >
                <CardHeader className="flex gap-3 justify-center">
                  <BuildOutlinedIcon />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">
                      Problèmes de maintenance
                    </h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-base text-justify font-normal mx-2.5">
                    Des réclamations concernant des problèmes de plomberie
                    (fuites, robinets qui fuient), des pannes électriques, des
                    dysfonctionnements des appareils électroménagers fournis par
                    le propriétaire, etc.
                  </p>
                </CardBody>
                <Divider />
                <CardFooter></CardFooter>
              </Card>
              <Modal
                isOpen={isMaintenanceModalOpen}
                onClose={closeMaintenanceModal}
              >
                <ModalContent>
                  <ModalHeader>Confirmation</ModalHeader>
                  <ModalBody>
                    <p>
                      Êtes-vous sûr de vouloir signaler des problèmes de
                      maintenance?
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={closeMaintenanceModal}
                    >
                      Annuler
                    </Button>
                    <Button color="primary" onClick={closeMaintenanceModal}>
                      Confirmer
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Card
                className="max-w-[400px]"
                isPressable
                onPress={() =>
                  handleComplaintConfirmation("Infestations de parasites")
                }
              >
                <CardHeader className="flex gap-3 justify-center">
                  <BugReportOutlinedIcon />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">
                      Infestations de parasites
                    </h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-base text-justify font-normal mx-2.5">
                    Des problèmes avec des insectes, des rongeurs ou d'autres
                    parasites peuvent nécessiter une intervention du
                    propriétaire pour les éliminer.
                  </p>
                </CardBody>
                <Divider />
                <CardFooter></CardFooter>
              </Card>
              <Modal
                isOpen={isInfestationModalOpen}
                onClose={closeInfestationModal}
              >
                <ModalContent>
                  <ModalHeader>Confirmation</ModalHeader>
                  <ModalBody>
                    <p>
                      Êtes-vous sûr de vouloir signaler une infestation de
                      parasites ?
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={closeInfestationModal}
                    >
                      Annuler
                    </Button>
                    <Button color="primary" onClick={closeInfestationModal}>
                      Confirmer
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Card
                className="max-w-[400px]"
                isPressable
                onPress={() =>
                  handleComplaintConfirmation("Défauts structurels")
                }
              >
                <CardHeader className="flex gap-3 justify-center">
                  <HomeRepairServiceOutlinedIcon />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">
                      Défauts structurels
                    </h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-base text-justify font-normal mx-2.5">
                    Des fissures dans les murs, des problèmes de toiture, des
                    portes ou fenêtres qui ne se ferment pas correctement, etc.
                  </p>
                </CardBody>
                <Divider />
                <CardFooter></CardFooter>
              </Card>
              <Modal
                isOpen={isStructuralModalOpen}
                onClose={closeStructuralModal}
              >
                <ModalContent>
                  <ModalHeader>Confirmation</ModalHeader>
                  <ModalBody>
                    <p>
                      Êtes-vous sûr de vouloir signaler des défauts structurels
                      ?
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={closeStructuralModal}
                    >
                      Annuler
                    </Button>
                    <Button color="primary" onClick={closeStructuralModal}>
                      Confirmer
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>

            <div className="flex flex-col mx-4 gap-y-4 justify-center">
              <Card
                className="max-w-[400px]"
                isPressable
                onPress={() =>
                  handleComplaintConfirmation(
                    "Questions liées aux équipements fournis"
                  )
                }
              >
                <CardHeader className="flex gap-3 justify-center">
                  <KitchenOutlinedIcon />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">
                      Questions liées aux équipements fournis
                    </h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-base text-justify font-normal mx-2.5">
                    Des réclamations concernant des équipements manquants ou des
                    appareils endommagés fournis par le propriétaire, comme des
                    meubles, des appareils électroménagers, etc.
                  </p>
                </CardBody>
                <Divider />
                <CardFooter></CardFooter>
              </Card>
              <Modal
                isOpen={isEquipmentModalOpen}
                onClose={closeEquipmentModal}
              >
                <ModalContent>
                  <ModalHeader>Confirmation</ModalHeader>
                  <ModalBody>
                    <p>
                      Êtes-vous sûr de vouloir signaler des problèmes liés aux
                      équipements fournis ?
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={closeEquipmentModal}
                    >
                      Annuler
                    </Button>
                    <Button color="primary" onClick={closeEquipmentModal}>
                      Confirmer
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Card
                className="max-w-[400px]"
                isPressable
                onPress={() =>
                  handleComplaintConfirmation(
                    "Problèmes d'humidité ou de moisissure"
                  )
                }
              >
                <CardHeader className="flex gap-3 justify-center">
                  <WaterDamageOutlinedIcon />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">
                      Problèmes d'humidité ou de moisissure
                    </h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-base text-justify font-normal mx-2.5">
                    Des réclamations concernant des problèmes d'humidité
                    excessive ou de moisissure dans le logement.
                  </p>
                </CardBody>
                <Divider />
                <CardFooter></CardFooter>
              </Card>
              <Modal isOpen={isMoistureModalOpen} onClose={closeMoistureModal}>
                <ModalContent>
                  <ModalHeader>Confirmation</ModalHeader>
                  <ModalBody>
                    <p>
                      Êtes-vous sûr de vouloir signaler des problèmes d'humidité
                      ou de moisissure ?
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={closeMoistureModal}
                    >
                      Annuler
                    </Button>
                    <Button color="primary" onClick={closeMoistureModal}>
                      Confirmer
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Card
                className="max-w-[400px]"
                isPressable
                onPress={() =>
                  handleComplaintConfirmation("Problèmes de voisinage")
                }
              >
                <CardHeader className="flex gap-3 justify-center">
                  <PeopleAltOutlinedIcon />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">
                      Problèmes de voisinage
                    </h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-base text-justify font-normal mx-2.5">
                    Des réclamations concernant le bruit excessif des voisins,
                    des conflits de voisinage, etc.
                  </p>
                </CardBody>
                <Divider />
                <CardFooter></CardFooter>
              </Card>
              <Modal isOpen={isNeighborModalOpen} onClose={closeNeighborModal}>
                <ModalContent>
                  <ModalHeader>Confirmation</ModalHeader>
                  <ModalBody>
                    <p>
                      Êtes-vous sûr de vouloir signaler des problèmes de
                      voisinage ?
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={closeNeighborModal}
                    >
                      Annuler
                    </Button>
                    <Button color="primary" onClick={closeNeighborModal}>
                      Confirmer
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>

            {/* <h1>Autres réclamations</h1> */}
            <div className="flex flex-row mx-4 mb-6 gap-x-11 justify-center">
              <Card
                className="max-w-[400px]"
                isPressable
                onPress={() => handleComplaintConfirmation("Autres problèmes")}
              >
                <CardHeader className="flex gap-3 justify-center">
                  <ReportProblemOutlinedIcon />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">Autres problèmes</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-base text-justify font-normal mx-2.5">
                    Pour signaler d'autres problèmes non mentionnés ci-dessus.
                  </p>
                </CardBody>
                <Divider />
                <CardFooter></CardFooter>
              </Card>
              <Modal
                isOpen={isAutreModalOpen}
                onClose={closeAutreModal}
                size="lg"
              >
                <ModalContent>
                  <ModalHeader>Confirmation</ModalHeader>
                  <ModalBody>
                    <p>
                      Êtes-vous sûr de vouloir signaler un autre problème ?
                      Veuillez fournir des détails précis sur le problème
                      rencontré afin que nous puissions vous aider de manière
                      adéquate.
                    </p>
                    <Textarea
                      isRequired
                      variant="bordered"
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Enter your description"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={closeAutreModal}
                    >
                      Annuler
                    </Button>
                    <Button color="primary" onClick={closeAutreModal}>
                      Confirmer
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </Carousel>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 mb-6">
            <Card
              className="max-w-full"
              isPressable
              onPress={() =>
                handleComplaintConfirmation("Problèmes de maintenance")
              }
            >
              <CardHeader className="flex gap-3 justify-center">
                <BuildOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold xl: text-lg 2xl: text-base">
                    Problèmes de maintenance
                  </h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-base text-justify font-normal mx-2.5">
                  Des réclamations concernant des problèmes de plomberie
                  (fuites, robinets qui fuient), des pannes électriques, des
                  dysfonctionnements des appareils électroménagers fournis par
                  le propriétaire, etc.
                </p>
              </CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
            <Modal
              isOpen={isMaintenanceModalOpen}
              onClose={closeMaintenanceModal}
            >
              <ModalContent>
                <ModalHeader>Confirmation</ModalHeader>
                <ModalBody>
                  <p>
                    Êtes-vous sûr de vouloir signaler des problèmes de
                    maintenance?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onClick={closeMaintenanceModal}
                  >
                    Annuler
                  </Button>
                  <Button color="primary" onClick={closeMaintenanceModal}>
                    Confirmer
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Card
              className="max-w-full"
              isPressable
              onPress={() =>
                handleComplaintConfirmation("Infestations de parasites")
              }
            >
              <CardHeader className="flex gap-3 justify-center">
                <BugReportOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold xl: text-lg 2xl: text-base">
                    Infestations de parasites
                  </h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-base text-justify font-normal mx-2.5">
                  Des problèmes avec des insectes, des rongeurs ou d'autres
                  parasites peuvent nécessiter une intervention du propriétaire
                  pour les éliminer.
                </p>
              </CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
            <Modal
              isOpen={isInfestationModalOpen}
              onClose={closeInfestationModal}
            >
              <ModalContent>
                <ModalHeader>Confirmation</ModalHeader>
                <ModalBody>
                  <p>
                    Êtes-vous sûr de vouloir signaler une infestation de
                    parasites ?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onClick={closeInfestationModal}
                  >
                    Annuler
                  </Button>
                  <Button color="primary" onClick={closeInfestationModal}>
                    Confirmer
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Card
              className="max-w-full"
              isPressable
              onPress={() => handleComplaintConfirmation("Défauts structurels")}
            >
              <CardHeader className="flex gap-3 justify-center">
                <HomeRepairServiceOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold xl: text-lg 2xl: text-base">Défauts structurels</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-base text-justify font-normal mx-2.5">
                  Des fissures dans les murs, des problèmes de toiture, des
                  portes ou fenêtres qui ne se ferment pas correctement, etc.
                </p>
              </CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
            <Modal
              isOpen={isStructuralModalOpen}
              onClose={closeStructuralModal}
            >
              <ModalContent>
                <ModalHeader>Confirmation</ModalHeader>
                <ModalBody>
                  <p>
                    Êtes-vous sûr de vouloir signaler des défauts structurels ?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onClick={closeStructuralModal}
                  >
                    Annuler
                  </Button>
                  <Button color="primary" onClick={closeStructuralModal}>
                    Confirmer
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Card
              className="max-w-full"
              isPressable
              onPress={() =>
                handleComplaintConfirmation(
                  "Questions liées aux équipements fournis"
                )
              }
            >
              <CardHeader className="flex gap-3 justify-center">
                <KitchenOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold xl: text-lg 2xl: text-base">
                    Questions liées aux équipements fournis
                  </h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-base text-justify font-normal mx-2.5">
                  Des réclamations concernant des équipements manquants ou des
                  appareils endommagés fournis par le propriétaire, comme des
                  meubles, des appareils électroménagers, etc.
                </p>
              </CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
            <Modal isOpen={isEquipmentModalOpen} onClose={closeEquipmentModal}>
              <ModalContent>
                <ModalHeader>Confirmation</ModalHeader>
                <ModalBody>
                  <p>
                    Êtes-vous sûr de vouloir signaler des problèmes liés aux
                    équipements fournis ?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onClick={closeEquipmentModal}
                  >
                    Annuler
                  </Button>
                  <Button color="primary" onClick={closeEquipmentModal}>
                    Confirmer
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Card
              className="max-w-full"
              isPressable
              onPress={() =>
                handleComplaintConfirmation(
                  "Problèmes d'humidité ou de moisissure"
                )
              }
            >
              <CardHeader className="flex gap-3 justify-center">
                <WaterDamageOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold xl: text-lg 2xl: text-base">
                    Problèmes d'humidité ou de moisissure
                  </h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-base text-justify font-normal mx-2.5">
                  Des réclamations concernant des problèmes d'humidité excessive
                  ou de moisissure dans le logement.
                </p>
              </CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
            <Modal isOpen={isMoistureModalOpen} onClose={closeMoistureModal}>
              <ModalContent>
                <ModalHeader>Confirmation</ModalHeader>
                <ModalBody>
                  <p>
                    Êtes-vous sûr de vouloir signaler des problèmes d'humidité
                    ou de moisissure ?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onClick={closeMoistureModal}
                  >
                    Annuler
                  </Button>
                  <Button color="primary" onClick={closeMoistureModal}>
                    Confirmer
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Card
              className="max-w-full"
              isPressable
              onPress={() =>
                handleComplaintConfirmation("Problèmes de voisinage")
              }
            >
              <CardHeader className="flex gap-3 justify-center">
                <PeopleAltOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold xl: text-lg 2xl: text-base">
                    Problèmes de voisinage
                  </h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-base text-justify font-normal mx-2.5">
                  Des réclamations concernant le bruit excessif des voisins, des
                  conflits de voisinage, etc.
                </p>
              </CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
            <Modal isOpen={isNeighborModalOpen} onClose={closeNeighborModal}>
              <ModalContent>
                <ModalHeader>Confirmation</ModalHeader>
                <ModalBody>
                  <p>
                    Êtes-vous sûr de vouloir signaler des problèmes de voisinage
                    ?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onClick={closeNeighborModal}
                  >
                    Annuler
                  </Button>
                  <Button color="primary" onClick={closeNeighborModal}>
                    Confirmer
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Card
              className="col-start-2"
              isPressable
              onPress={() => handleComplaintConfirmation("Autres problèmes")}
            >
              <CardHeader className="flex gap-3 justify-center">
                <ReportProblemOutlinedIcon />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold xl: text-lg 2xl: text-base">Autres problèmes</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-base text-justify font-normal mx-2.5">
                  Pour signaler d'autres types de problèmes non mentionnés
                  ci-dessus.
                </p>
              </CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
            <Modal
              isOpen={isAutreModalOpen}
              onClose={closeAutreModal}
              size="lg"
            >
              <ModalContent>
                <ModalHeader>Confirmation</ModalHeader>
                <ModalBody>
                  <p>
                    Êtes-vous sûr de vouloir signaler un autre problème ?
                    Veuillez fournir des détails précis sur le problème
                    rencontré afin que nous puissions vous aider de manière
                    adéquate.
                  </p>
                  <Textarea
                    isRequired
                    variant="bordered"
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter your description"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onClick={closeAutreModal}
                  >
                    Annuler
                  </Button>
                  <Button color="primary" onClick={closeAutreModal}>
                    Confirmer
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </>
      )}
    </>
  );
};

ReclaCard.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ReclaCard;
