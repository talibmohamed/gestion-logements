import React, { useState } from "react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Link,
} from "@nextui-org/react";
import profData from "./components/profData";
import "./Overview.scss";

const Profile = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage(
        "Le nouveau mot de passe doit comporter au moins 6 caractères."
      );
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
                            base: "bg-[#171821] dark:bg-[#171821] text-[white]",
                          }}
                        >
                          <ModalContent>
                            {(onClose) => (
                              <>
                                <ModalHeader className="flex flex-col gap-1">
                                  Changer Votre Mot De Passe
                                </ModalHeader>
                                <ModalBody>
                                  <Input
                                    autoFocus
                                    label="Nouveau Mot De Passe"
                                    type="password"
                                    variant="bordered"
                                    value={newPassword}
                                    onChange={(e) =>
                                      setNewPassword(e.target.value)
                                    }
                                  />
                                  <Input
                                    label="Confirmer Votre Mot de Passe"
                                    type="password"
                                    variant="bordered"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                      setConfirmPassword(e.target.value)
                                    }
                                  />
                                  <p className="text-base text-justify font-normal mt-3">
                                    Le mot de passe doit se composer d'au moins
                                    6 charactères.
                                    <br />
                                    Votre nouveau mot de passe ne doit pas être
                                    similaire a vos derniers mot de passes
                                    utilisés.
                                  </p>
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
                                    onPress={onClose}
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
