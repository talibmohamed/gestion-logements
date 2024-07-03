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
// import { Carousel } from "react-responsive-carousel"; // Removed Carousel import
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // Removed import
import { useDispatch } from "react-redux";
import { addReclamationThunk } from "../../../../../session/thunks/userthunks"; // Import your thunk
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toasts

const complaintTypes = [
  {
    title: "Problèmes de maintenance",
    icon: <BuildOutlinedIcon sx={{ color: "#ff8906" }} />,
    description:
      "Des réclamations concernant des problèmes de plomberie (fuites, robinets qui fuient), des pannes électriques, des dysfonctionnements des appareils électroménagers fournis par le propriétaire, etc.",
    showing:
      "Des réclamations concernant des problèmes de plomberie (fuites, robinets qui fuient), des pannes électriques, des dysfonctionnements des appareils électroménagers fournis par le propriétaire, etc.",
  },
  {
    title: "Infestations de parasites",
    icon: <BugReportOutlinedIcon sx={{ color: "#ff8906" }} />,
    description:
      "Des problèmes avec des insectes, des rongeurs ou d'autres parasites peuvent nécessiter une intervention du propriétaire pour les éliminer.",
    showing:
      "Des problèmes avec des insectes, des rongeurs ou d'autres parasites peuvent nécessiter une intervention du propriétaire pour les éliminer.",
  },
  {
    title: "Défauts structurels",
    icon: <HomeRepairServiceOutlinedIcon sx={{ color: "#ff8906" }} />,
    description:
      "Des fissures dans les murs, des problèmes de toiture, des portes ou fenêtres qui ne se ferment pas correctement, etc.",
    showing:
      "Des fissures dans les murs, des problèmes de toiture, des portes ou fenêtres qui ne se ferment pas correctement, etc.",
  },
  {
    title: "Questions liées aux équipements fournis",
    icon: <KitchenOutlinedIcon sx={{ color: "#ff8906" }} />,
    description:
      "Des réclamations concernant des équipements manquants ou des appareils endommagés fournis par le propriétaire, comme des meubles, des appareils électroménagers, etc.",
    showing:
      "Des réclamations concernant des équipements manquants ou des appareils endommagés fournis par le propriétaire, comme des meubles, des appareils électroménagers, etc.",
  },
  {
    title: "Problèmes d'humidité ou de moisissure",
    icon: <WaterDamageOutlinedIcon sx={{ color: "#ff8906" }} />,
    description:
      "Des réclamations concernant des problèmes d'humidité excessive ou de moisissure dans le logement.",
    showing:
      "Des réclamations concernant des problèmes d'humidité excessive ou de moisissure dans le logement.",
  },
  {
    title: "Problèmes de voisinage",
    icon: <PeopleAltOutlinedIcon sx={{ color: "#ff8906" }} />,
    description:
      "Des réclamations concernant le bruit excessif des voisins, des conflits de voisinage, etc.",
    showing:
      "Des réclamations concernant le bruit excessif des voisins, des conflits de voisinage, etc.",
  },
  {
    title: "Autres problèmes",
    icon: <ReportProblemOutlinedIcon sx={{ color: "#ff8906" }} />,
    showing:
      "Pour signaler d'autres types de problèmes non mentionnés ci-dessus.",
    description: "", // Empty string for Autres problèmes
  },
];

const ReclaCard = ({ title }) => {
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(false);
  const [currentComplaint, setCurrentComplaint] = useState(null);
  const [otherProblemDescription, setOtherProblemDescription] = useState(""); // State for user input

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleComplaintConfirmation = (complaint) => {
    setCurrentComplaint(complaint);
    openModal();
  };

  const handleConfirm = async () => {
    if (currentComplaint) {
      // Prepare the data for your thunk
      const reclamationData = {
        rec_type: currentComplaint.title,
        rec_desc: currentComplaint.description,
      };

      const loadingToastId = toast.loading("Ajout de la réclamation...", {
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
        // Dispatch your thunk
        const response = await dispatch(addReclamationThunk(reclamationData));

        toast.dismiss(loadingToastId);

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
          closeModal(); // Close the modal after success
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
        console.error("Error adding reclamation:", error);
        toast.error(
          "Une erreur s'est produite lors de l'ajout de la réclamation",
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: 0,
            theme: "dark",
          }
        );
      }
    }
    closeModal();
  };

  return (
    <>
      <div className="flex flex-col ml-4 mt-2 mb-6">
        <h1>{title}</h1>
      </div>
      {isMobile ? (
        // Stack cards on top of each other on small screens
        <div className="flex flex-col gap-6 mx-4 mb-6">
          {complaintTypes.map((complaint, index) => (
            <Card
              key={index}
              className="w-full bg-black bg-opacity-40 backdrop-blur-sm"
              isPressable
              onPress={() => handleComplaintConfirmation(complaint)}
            >
              <CardHeader className="flex gap-3 justify-center">
                {complaint.icon}
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-[#fffffe] 2xl:">
                    {complaint.title}
                  </h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-base text-justify font-normal mx-2.5 text-[#fff3ec]">
                  {complaint.showing} {/* Display "showing" */}
                </p>
              </CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        //  3x3 grid for desktop
        <div
          className="grid grid-cols-3 gap-6 mx-4 mb-6 gap-y-8"
          style={{ display: "grid", gridTemplateRows: "repeat(2, 1fr)" }}
        >
          {/* Render first 6 cards normally */}
          {complaintTypes.slice(0, 6).map((complaint, index) => (
            <Card
              key={index}
              className="max-w-full bg-black bg-opacity-40 backdrop-blur-sm"
              isPressable
              onPress={() => handleComplaintConfirmation(complaint)}
            >
              <CardHeader className="flex gap-3 justify-center">
                {complaint.icon}
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-[#fffffe] 2xl:">
                    {complaint.title}
                  </h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-base text-justify font-normal mx-2.5 text-[#fff3ec]">
                  {complaint.showing}
                </p>
              </CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
          ))}
          {/* Render the last card in a centered column */}
          <div
            className="col-span-3"
            style={{ display: "grid", placeItems: "center" }}
          >
            <Card
              key={6}
              className="max-w-full bg-black bg-opacity-40 backdrop-blur-sm"
              isPressable
              onPress={() => handleComplaintConfirmation(complaintTypes[6])}
            >
              <CardHeader className="flex gap-3 justify-center">
                {complaintTypes[6].icon}
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-[#fffffe] 2xl:">
                    {complaintTypes[6].title}
                  </h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-base text-justify font-normal mx-2.5 text-[#fff3ec]">
                  {complaintTypes[6].showing}
                </p>
              </CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>
            {currentComplaint && (
              <>
                <p>
                  Êtes-vous sûr de vouloir signaler un {currentComplaint.title}{" "}
                  ?
                </p>
                {currentComplaint.title === "Autres problèmes" && (
                  <Textarea
                    isRequired
                    variant="bordered"
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter your description"
                    value={otherProblemDescription}
                    onChange={(e) => setOtherProblemDescription(e.target.value)}
                    maxLength={255} // Set max length
                  />
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={closeModal}>
              Annuler
            </Button>
            {currentComplaint && (
              <Button color="primary" onClick={handleConfirm}>
                Confirmer
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ReclaCard.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ReclaCard;
