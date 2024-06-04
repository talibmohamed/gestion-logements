import React, { useState, useEffect } from "react";
import { Card, CardBody, Input, Button, Checkbox } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import profData from "./components/profData";
import "./Overview.scss";
import { EyeFilledIcon } from "./Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./Icons/EyeSlashFilledIcon";

const Profile = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisibleNew, setIsVisibleNew] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);

  const toggleVisibilityNew = () => setIsVisibleNew(!isVisibleNew);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);

  useEffect(() => {
    validatePassword(newPassword);
  }, [newPassword]);

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

  //chech the password confirmation while typing it
  const validateConfirmation = (confirmationPassword) => {
    if (confirmationPassword !== newPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
    } else {
      setErrorMessage("");
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setErrorMessage("Le nouveau mot de passe ne répond pas aux critères.");
      return;
    }

    console.log("Mot de passe changé avec succès!");
    setErrorMessage("");
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

            {/*------------  INFO SECTION ------------- */}

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
                        defaultValue={profData.dateAjout}
                        className="mb-4 max-w-md"
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
                        className=" mb-4 max-w-md border-solid border-2 border-zinc-700 mt-6 w-full justify-start"
                      >
                        Changer Le Mot De Passe
                      </Button>
                    </div>
                    <div className="mb-4 max-w-md btn-pwd">
                      <>
                        <Modal
                          backdrop="blur"
                          isOpen={isOpen}
                          onOpenChange={onOpenChange}
                          placement="center"
                          classNames={{
                            base: "bg-[#171821] dark:bg-[#171821] text-[white] ",
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
                                    value={newPassword}
                                    onChange={(e) =>
                                      setNewPassword(e.target.value)
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
                                    value={confirmPassword}
                                    onChange={(e) => {
                                      setConfirmPassword(e.target.value);
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
                                    <label className="flex items-center mb-2">
                                      <Checkbox
                                        isSelected={hasUpperCase}
                                        isReadOnly
                                      />
                                      <span className="mr-2">
                                        1 Lettre majuscule
                                      </span>
                                    </label>
                                    <label className="flex items-center mb-2">
                                      <Checkbox
                                        isSelected={hasNumber}
                                        isReadOnly
                                      />
                                      <span className="mr-2">1 Nombre</span>
                                    </label>
                                    <label className="flex items-center mb-2">
                                      <Checkbox
                                        isSelected={hasSpecialChar}
                                        isReadOnly
                                      />
                                      <span className="mr-2">
                                        Au moins 1 caractère spécial
                                      </span>
                                    </label>
                                    <label className="flex items-center mb-2">
                                      <Checkbox
                                        isSelected={hasMinLength}
                                        isReadOnly
                                      />
                                      <span className="mr-2">
                                        Au moins 12 caractères
                                      </span>
                                    </label>
                                  </div>

                                  <p className="text-base text-justify font-normal mt-3">
                                    Le mot de passe doit se composer d'au moins
                                    12 charactères.
                                    <br />
                                    Votre nouveau mot de passe ne doit pas être
                                    similaire a vos derniers mot de passes
                                    utilisés.
                                  </p>
                                  {errorMessage && (
                                    <p className="text-red-500">
                                      {errorMessage}
                                    </p>
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
                                      // onClose(); it sshoudnt close the module cuz we need to see it the is any errors or the password changer
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

              {/*--------------- ADRESSE SECTION -------------------*/}
              <CardBody>
                <h3 className="mt-3 ml-3 text-left mb-2">Adresse</h3>
              </CardBody>
            </CardBody>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
