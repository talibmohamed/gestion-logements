import React, { useState } from "react";
import "../../../index.css";
import logo from "./logo.svg";
import sunset from "./sunset.jpeg";
import "../style.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUserThunk,
  forgotPasswordThunk,
} from "../../../session/thunks/userthunks";
import { EyeFilledIcon } from "../EyeFilledIcon";
import { EyeSlashFilledIcon } from "../EyeSlashFilledIcon";
import { MailIcon } from "./MailIcon.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Link,
} from "@nextui-org/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState(""); // Added state for forgot email
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const action = await dispatch(loginUserThunk({ email, password }));
      const response = action.payload; // Extract the payload data
      if (response.status === "success") {
        navigate("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle email confirmation
  const handleConfirmEmail = async () => {
    if (forgotEmail) {
      console.log(forgotEmail);
      // Show loading toast while processing
      const loadingToastId = toast.loading("Sending email...", {
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
        const action = await dispatch(forgotPasswordThunk(forgotEmail));
        const response = action.payload;
        console.log(response);
        if (response.status === "success") {
          toast.update(loadingToastId, {
            render: "Email sent successfully",
            type: "success",
            isLoading: false,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.update(loadingToastId, {
            render: response.message,
            type: "error",
            isLoading: false,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      } catch {
        toast.update(loadingToastId, {
          render: "Error sending email",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } else {
      console.log("Email not entered");
    }
  };
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      {/* Login container */}
      <div className="flex rounded-2xl shadow-xl max-w-7xl p-5 items-center">
        {/* Form */}
        <div className="md:w-1/2 px-14">
          <div className="flex mb-8 items-center">
            <img className="currentColor logo" src={logo} alt="Logo" />
            <p className="ml-4 font-[lato] font-extrabold text-2xl houselytics">
              Houselytics
            </p>
          </div>
          <h2 className="font-[lato] font-bold text-3xl mb-3">
            Connectez-vous à votre compte
          </h2>
          {error && <div className="error">{error}</div>}
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="email-group">
              <Input
                size="md"
                type="email"
                label="Email"
                variant="bordered"
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 mt-4"
              />
            </div>
            <div className="password-group">
              <Input
                size="md"
                label="Mot de passe"
                variant="bordered"
                onChange={(e) => setPassword(e.target.value)}
                endContent={
                  <button
                    className="visibility-toggle"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="icon" />
                    ) : (
                      <EyeFilledIcon className="icon" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="p-2 mb-2"
              />
            </div>
            <div className="button-container">
              <Button className="login" type="submit" size="md">
                Se connecter
              </Button>
            </div>
          </form>

          <div className="mt-10 grid grid-cols-3 items-center">
            <hr className="border-currentColor"></hr>
            <p className="text-center"></p>
            <hr className="border-currentColor"></hr>
          </div>

          <div className="text-center">
            <Link
              onPress={onOpen}
              className="text-[#3b82f6] mt-4 text-sm"
              href="#"
            >
              Mot de passe oublié?
            </Link>
            <Modal
              size="md"
              classNames={{
                base: "bg-[#18181b] dark:bg-[#18181b] text-[#e4e4e7]",
                closeButton: "hover:bg-white/5 active:bg-white/10",
              }}
              backdrop="opaque"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              motionProps={{
                variants: {
                  enter: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  },
                  exit: {
                    y: -20,
                    opacity: 0,
                    transition: {
                      duration: 0.2,
                      ease: "easeIn",
                    },
                  },
                },
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Difficultés de connexion?
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        Entrez votre adresse courriel et nous vous enverrons un
                        lien pour récupérer votre compte.
                      </p>
                      <Input
                        size="md"
                        autoFocus
                        endContent={
                          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Email"
                        placeholder="Entrer votre adresse courriel"
                        variant="bordered"
                        onChange={(e) => setForgotEmail(e.target.value)} // Update forgot email state
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
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="primary"
                        onPress={() => {
                          handleConfirmEmail(); // Call the function to log the email
                          onClose(); // Close the modal
                        }}
                      >
                        Confirmer
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>

        {/* Image */}
        <div className="md:block hidden w-1/2">
          <img className="rounded-2xl" src={sunset} alt="Sunset" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
