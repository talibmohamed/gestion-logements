import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResidantsThunk } from '../../../../session/thunks/adminthunk.jsx';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ResidantTable from "./components/resTab.jsx";
import "./Statics.scss";
import { Card, CardBody } from "@nextui-org/react";
import { columns } from "./components/resData.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Residant = () => {
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
  
    const dispatch = useDispatch();
    const residantsState = useSelector(state => state.residants);
    const residants = residantsState?.residants || [];

    console.log("1");
    console.log(residantsState);
    console.log("1");

  
    useEffect(() => {
      dispatch(fetchResidantsThunk()); 
    }, [dispatch]); 
  
    const transformResidantsData = (residants) => {
      return residants.map((residant) => ({
        id: residant.res_id,
        res_id: residant.res_id,
        nom: residant.nom,
        prenom: residant.prenom,
        cin: residant.cin,
        email: residant.email,
        profession: residant.profession,
        ameliored: residant.is_ameliore ? 'Oui' : 'Non',
        telephone: residant.telephone,
      }));
    };
    const transformedResidants = transformResidantsData(residants);  

  return (
    <div className="container mx-auto">
      <div className=" w-full ">
        <Card
          isBlurred
          className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper w-full over"
          shadow="sm"
        >
          <CardBody>
            <ResidantTable columns={columns} rows={transformedResidants} title="Residants" />
          </CardBody>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Residant;
