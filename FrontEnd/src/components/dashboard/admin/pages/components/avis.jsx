import React, { useState } from "react";
import { Card, CardBody, Textarea, Input, Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { sendNotificationThunk } from "../../../../../session/thunks/adminthunk";
import { toast } from "react-toastify";

const Avis = () => {
  const dispatch = useDispatch();
  const [resId, setResId] = useState("");
  const [description, setDescription] = useState("");

  const handleSendAvis = async () => {
    const notificationData = {
      res_id: resId,
      notif_desc: description,
      notif_titre: "Avis de facture en retard",
    };

    // Show loading toast while processing
    const loadingToastId = toast.loading("envoyer un avis...", {
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
      const response = await dispatch(
        sendNotificationThunk(notificationData)
      ).unwrap();

      console.log(response);

      // Clear loading toast
      toast.dismiss(loadingToastId);

      // Display success message
      if (response && response.status === "success") {
        toast.success("Notification envoyée pour la facture en retard", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: "dark",
        });      

        setResId("");
        setDescription("");
      } else if (response && response.status === "alert") {
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
      } else {
        // Handle other statuses or errors
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
      setResId("");
      setDescription("");
    } catch (error) {
      console.error("Error sending avis:", error);
      toast.error("An error occurred while adding Facture", {
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
  };

  return (
    <Card
      isBlurred
      className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
      shadow="sm"
    >
      <CardBody>
        <h2 className="mx-2 mb-4 flex justify-between items-center">
          Envoyer un avis de facture en retard
          <div className="flex gap-3">
          <Button
                  color="danger"
                  variant="light"
                  className="text-sm font-medium" onClick={handleSendAvis}>
              Envoyer !
            </Button>
          </div>
        </h2>
        <div className="reclMsg">
          <Input
            variant="bordered"
            type="text"
            label="Id résidant"
            labelPlacement="outside-left"
            size="sm"
            value={resId}
            onChange={(e) => setResId(e.target.value)}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">#</span>
              </div>
            }
            className="custom-input max-w-xs mb-2 ml-2 "
            classNames={{
              label: "text-sm font-normal",
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <Textarea
            variant="bordered"
            labelPlacement="outside"
            placeholder="Entrer votre description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="max-w-5xl mb-4"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default Avis;
