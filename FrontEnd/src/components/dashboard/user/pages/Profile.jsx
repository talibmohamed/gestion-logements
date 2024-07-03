import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Input, Button, Checkbox } from "@nextui-org/react";
import Alert from "@mui/material/Alert";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { changePasswordThunk } from "../../../../session/thunks/userthunks";
import { EyeFilledIcon } from "./Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./Icons/EyeSlashFilledIcon";
import "./Overview.scss";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { toast, ToastContainer } from "react-toastify";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const Profile = () => {
  const position = [32.375289, -6.318726];

  const dispatch = useDispatch();

  const [password, setpassword] = useState("");
  const [confirmedPassword, setconfirmedPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setsuccess] = useState("");
  const [isVisibleNew, setIsVisibleNew] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);

  const toggleVisibilityNew = () => setIsVisibleNew(!isVisibleNew);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (password) => {
    const upperCase = /[A-Z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = password.length >= 12;

    setHasUpperCase(upperCase);
    setHasNumber(number);
    setHasSpecialChar(specialChar);
    setHasMinLength(minLength);

    return upperCase && number && specialChar && minLength;
  };

  const validateConfirmation = (confirmationPassword) => {
    if (confirmationPassword !== password) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
    } else {
      setErrorMessage("");
    }
  };

  const handleChangePassword = async () => {
    if (password !== confirmedPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    } else {
      setErrorMessage("");
    }
    if (!validatePassword(password)) {
      setErrorMessage("Le nouveau mot de passe ne répond pas aux critères.");
      return;
    }

    try {
      // Call the API function to change the password
      const loadingToastId = toast.loading("Cancelling reclamation...", {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: 0,
        theme: "dark",
      });

      const response = await dispatch(
        changePasswordThunk({ password, confirmedPassword })
      ).unwrap();

      toast.dismiss(loadingToastId);

      if (response.status === "success") {
        toast.success(response.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: "dark",
        });

        setpassword("");
      } else {
        toast.error(response.message, {
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

      console.log(response.message);
    } catch (error) {
      console.error("Error changing password:", error);
      setErrorMessage(
        "Une erreur s'est produite lors du changement de mot de passe."
      );
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //calling the api profile
  useEffect(() => {
    // dispatch(fetchUserProfileThunk());
  }, [dispatch]);

  console.log("1111");
  const profData = useSelector((state) => state.user);

  console.log(profData);
  console.log("1111");

  if (!profData || !profData.nom) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="card-wrapper">
        <Card
          isBlurred
          className="border-none bg-background/15 white:bg-default-100/50"
          shadow="sm"
        >
          <CardBody>
            <h2 className="mt-3 ml-3 text-left">Profile</h2>

            <CardBody>
              <h3 className="mt-3 ml-3 text-left mb-2">
                Informations générales
              </h3>
              <Card className="bg-transparent" shadow="none">
                <CardBody className="flex flex-column ml-2">
                  <div className="grid grid-cols-1 mt-2 md:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                      <Input
                        isReadOnly
                        type="text"
                        label="Nom"
                        variant="bordered"
                        defaultValue={profData.nom}
                        className="mb-4 max-w-md"
                        size="lg"
                        labelPlacement="outside"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <Input
                        isReadOnly
                        type="text"
                        label="Prénom"
                        variant="bordered"
                        defaultValue={profData.prenom}
                        className="mb-4 max-w-md"
                        size="lg"
                        labelPlacement="outside"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <Input
                        isReadOnly
                        type="email"
                        label="Email"
                        variant="bordered"
                        defaultValue={profData.email}
                        className="mb-4 max-w-md"
                        size="lg"
                        labelPlacement="outside"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <Input
                        isReadOnly
                        type="text"
                        label="Téléphone"
                        variant="bordered"
                        defaultValue={profData.telephone}
                        className="mb-4 max-w-md"
                        size="lg"
                        labelPlacement="outside"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <Input
                        isReadOnly
                        type="text"
                        label="Date d'ajout"
                        variant="bordered"
                        defaultValue={profData.date_ajout}
                        className="max-w-md"
                        size="lg"
                        labelPlacement="outside"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <Button
                        onPress={onOpen}
                        label="Password"
                        color="transparent"
                        size="lg"
                        className=" max-w-md border-solid border-2 border-zinc-700 mt-6 w-full justify-start"
                      >
                        Changer Le Mot De Passe
                      </Button>
                    </div>
                    <div className="mb-4 max-w-md btn-pwd">
                      <>
                        <Modal
                          isOpen={isOpen}
                          onOpenChange={onOpenChange}
                          classNames={{
                            base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
                            closeButton: "hover:bg-white/5 active:bg-white/10",
                          }}
                        >
                          <ModalContent>
                            {(onClose) => (
                              <>
                                <ModalHeader className="flex flex-col gap-1">
                                  Changer Votre Mot De Passe
                                </ModalHeader>
                                <ModalBody className="modal-body-custom">
                                  <Input
                                    autoFocus
                                    label="Nouveau Mot De Passe"
                                    variant="bordered"
                                    value={password}
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
                                      setpassword(e.target.value)
                                    }
                                    endContent={
                                      <button
                                        className="visibility-toggle"
                                        type="button"
                                        onClick={toggleVisibilityNew}
                                      >
                                        {isVisibleNew ? (
                                          <EyeSlashFilledIcon className="icon" />
                                        ) : (
                                          <EyeFilledIcon className="icon" />
                                        )}
                                      </button>
                                    }
                                    type={isVisibleNew ? "text" : "password"}
                                  />
                                  <Input
                                    label="Confirmer Votre Mot de Passe"
                                    variant="bordered"
                                    value={confirmedPassword}
                                    className="mb-2"
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
                                    onChange={(e) => {
                                      setconfirmedPassword(e.target.value);
                                      validateConfirmation(e.target.value);
                                    }}
                                    endContent={
                                      <button
                                        className="visibility-toggle"
                                        type="button"
                                        onClick={toggleVisibilityConfirm}
                                      >
                                        {isVisibleConfirm ? (
                                          <EyeSlashFilledIcon className="icon" />
                                        ) : (
                                          <EyeFilledIcon className="icon" />
                                        )}
                                      </button>
                                    }
                                    type={
                                      isVisibleConfirm ? "text" : "password"
                                    }
                                  />
                                  <div className="password-requirements">
                                    <label className="flex items-center mb-2 mt-2">
                                      <Checkbox
                                        size="sm"
                                        isSelected={hasUpperCase}
                                        isReadOnly
                                      />
                                      <span className="mr-2">
                                        Une lettre majuscule
                                      </span>
                                    </label>
                                    <label className="flex items-center mb-2">
                                      <Checkbox
                                        size="sm"
                                        isSelected={hasNumber}
                                        isReadOnly
                                      />
                                      <span className="mr-2">Un nombre</span>
                                    </label>
                                    <label className="flex items-center mb-2">
                                      <Checkbox
                                        size="sm"
                                        isSelected={hasSpecialChar}
                                        isReadOnly
                                      />
                                      <span className="mr-2">
                                        Au moins un caractère spécial
                                      </span>
                                    </label>
                                    <label className="flex items-center mb-2">
                                      <Checkbox
                                        size="sm"
                                        isSelected={hasMinLength}
                                        isReadOnly
                                      />
                                      <span className="mr-2">
                                        Au moins 12 caractères
                                      </span>
                                    </label>
                                  </div>
                                  {/*alerts for the password change using MUI*/}
                                  {success && (
                                    <Alert
                                      variant="outlined"
                                      severity="success"
                                    >
                                      {success}
                                    </Alert>
                                  )}
                                  {errorMessage && (
                                    <Alert
                                      // variant="outlined"
                                      severity="error"
                                    >
                                      {errorMessage}
                                    </Alert>
                                  )}
                                </ModalBody>
                                <ModalFooter>
                                  <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                  >
                                    Fermer
                                  </Button>
                                  <Button
                                    className="bg-blue-500 text-zinc-50"
                                    onPress={() => {
                                      handleChangePassword();
                                    }}
                                  >
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
                </CardBody>
              </Card>

              <CardBody>
                <h3 className=" text-left mb-2">Address</h3>
                <div className="map-sidebar">
                  <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: "400px" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                      <Tooltip direction="top" opacity={0.8} permanent>
                        <span>{profData.address}</span>
                      </Tooltip>{" "}
                    </Marker>
                  </MapContainer>
                </div>
              </CardBody>
            </CardBody>
          </CardBody>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
