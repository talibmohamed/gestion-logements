// svgMappings.jsx
import Baignoire from "../equipIcons/Baignoire.jsx";
import noBalcony from "../equipIcons/noBalcony.jsx";
import Balcon from "../equipIcons/Balcon.jsx";
import Douche from "../equipIcons/Douche.jsx";
import Clim from "../equipIcons/Clim.jsx";
import Closet from "../equipIcons/Closet.jsx";
import Dishwasher from "../equipIcons/Dishwasher.jsx";
import Four from "../equipIcons/Four.jsx";
import Gym from "../equipIcons/Gym.jsx";
import Heating from "../equipIcons/Heating.jsx";
import Jardin from "../equipIcons/Jardin.jsx";
import Microwave from "../equipIcons/Microwave.jsx";
import Parking from "../equipIcons/Parking.jsx";
import Refrigerateur from "../equipIcons/Refrigerateur.jsx";
import Stove from "../equipIcons/Stove.jsx";
import Station from "../equipIcons/Station.jsx";
import Terasse from "../equipIcons/Terasse.jsx";
import WashingMachine from "../equipIcons/WashingMachine.jsx";
import Dryer from "../equipIcons/Dryer.jsx";
import Security from "../equipIcons/Security.jsx";
import Wifi from "../equipIcons/Wifi.jsx";

const IconMappings = {
  /*SDB*/
  Baignoire: Baignoire,
  Douche: Douche,

  /*Cuisine*/
  Four: Four,
  Réfrigérateur: Refrigerateur,
  "Lave-vaisselle": Dishwasher,
  "Four à micro-ondes": Microwave,
  "Cuisinière électrique": Stove,
  "Cuisinière à gaz": Stove,

  /*Chambre*/
  "Lave-linge": WashingMachine,
  "Sèche-linge": Dryer,
  "Espaces de rangement (placards intégrés, dressing)": Closet,
  "Espaces de rangement suffisants": Closet,
  "Rangement minimal": Closet,

  /*Chauffage et climatisation*/
  "Climatisation central": Clim,
  "Chauffage central": Heating,
  "Chauffage électrique": Heating,
  "Chauffage au gaz": Heating,

  /*exterieur*/
  "Pas de balcon": noBalcony,
  "Balcon ou terasse spacieux": Balcon,
  "Petit balcon": Balcon,
  "Jardins privés ou espaces verts personnels": Jardin,
  "Espaces verts communs": Jardin,
  Terasse: Terasse,
  Balcon: Balcon,

  /*parking et securite*/
  "Accès à des équipements de fitness en plein air": Gym,
  "Place de parking dédiée avec point de recharge pour véhicules électriques": Station,
  "Place de parking partagée": Parking,
  "Accès à un parking commun": Parking,
  "Parking commun": Parking,
  
  "Système de sécurité": Security,
  "Wifi": Wifi,
};

export { IconMappings };
