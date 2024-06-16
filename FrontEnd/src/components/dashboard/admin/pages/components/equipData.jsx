import { svgMappings } from "svgMappings"; // Adjust the path accordingly

const equipementsData = {
  cadre: {
    Oui: {
      interieur: [
        {
          name: "baignoire",
          svg: svgMappings["baignoire"],
        },
        {
          name: "douche",
          svg: svgMappings["douche"],
        },

        {
          name: "clim",
          svg: svgMappings["clim"],
        },
        {
          name: "heating",
          svg: svgMappings["heating"],
        },

        {
          name: "closet",
          svg: svgMappings["closet"],
        },

        {
          name: "dishwasher",
          svg: svgMappings["dishwasher"],
        },
        {
          name: "four",
          svg: svgMappings["four"],
        },
        {
          name: "refrigerateur",
          svg: svgMappings["refrigerateur"],
        },
        {
          name: "stove",
          svg: svgMappings["stove"],
        },
        {
          name: "microwave",
          svg: svgMappings["microwave"],
        },
      ],
      exterieur: [
        {
          name: "balcon",
          svg: svgMappings["balcon"],
        },
        {
          name: "jardin",
          svg: svgMappings["jardin"],
        },
        {
          name: "parking",
          svg: svgMappings["parking"],
        },
        {
          name: "terasse",
          svg: svgMappings["terasse"],
        },
      ],
    },
    Non: {
      interieur: [
        {
          name: "four",
          svg: svgMappings["four"],
        },
        {
          name: "refrigerateur",
          svg: svgMappings["refrigerateur"],
        },
        {
          name: "stove",
          svg: svgMappings["stove"],
        },
        {
          name: "microwave",
          svg: svgMappings["microwave"],
        },

        {
          name: "heating",
          svg: svgMappings["heating"],
        },

        {
          name: "closet",
          svg: svgMappings["closet"],
        },
      ],
      exterieur: [
        {
          name: "parking",
          svg: svgMappings["parking"],
        },
      ],
    },
  },
  agent_de_maitrise: {
    Oui: {
      interieur: [
        {
          name: "heating",
          svg: svgMappings["heating"],
        },

        {
          name: "closet",
          svg: svgMappings["closet"],
        },

        {
          name: "refrigerateur",
          svg: svgMappings["refrigerateur"],
        },
        {
          name: "stove",
          svg: svgMappings["stove"],
        },
        {
          name: "balcon",
          svg: svgMappings["balcon"],
        },
      ],
      exterieur: [
        {
          name: "jardin",
          svg: svgMappings["jardin"],
        },
        {
          name: "parking",
          svg: svgMappings["parking"],
        },
      ],
    },
    Non: {
      interieur: [
        {
          name: "refrigerateur",
          svg: svgMappings["refrigerateur"],
        },
        {
          name: "stove",
          svg: svgMappings["stove"],
        },

        {
          name: "heating",
          svg: svgMappings["heating"],
        },

        {
          name: "closet",
          svg: svgMappings["closet"],
        },
      ],
      exterieur: [
        {
          name: "parking",
          svg: svgMappings["parking"],
        },
      ],
    },
  },
  ouvrier: {
    Oui: {
      interieur: [
        {
          name: "douche",
          svg: svgMappings["douche"],
        },

        {
          name: "clim",
          svg: svgMappings["clim"],
        },
        {
          name: "heating",
          svg: svgMappings["heating"],
        },

        {
          name: "closet",
          svg: svgMappings["closet"],
        },

        {
          name: "refrigerateur",
          svg: svgMappings["refrigerateur"],
        },
        {
          name: "stove",
          svg: svgMappings["stove"],
        },
        {
          name: "microwave",
          svg: svgMappings["microwave"],
        },
        {
          name: "balcon",
          svg: svgMappings["balcon"],
        },
      ],
      exterieur: [
        {
          name: "jardin",
          svg: svgMappings["jardin"],
        },
        {
          name: "parking",
          svg: svgMappings["parking"],
        },
      ],
    },
    Non: {
      interieur: [
        {
          name: "refrigerateur",
          svg: svgMappings["refrigerateur"],
        },
        {
          name: "stove",
          svg: svgMappings["stove"],
        },

        {
          name: "heating",
          svg: svgMappings["heating"],
        },

        {
          name: "closet",
          svg: svgMappings["closet"],
        },
      ],
      exterieur: [
        {
          name: "parking",
          svg: svgMappings["parking"],
        },
      ],
    },
  },
};

export const getEquipements = (type, ameliored) => {
  const amelioration = ameliored ? "ameliored" : "non_ameliored";
  return equipementsData[type.toLowerCase()][amelioration];
};
