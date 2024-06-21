import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import PropTypes from "prop-types";


const xLabels = ["Janvier", "Fevrier", "Mars", "Avril", "May", "Juin"];

const Graph = ({ title, data }) => {
  const getWidth = () => {
    if (window.innerWidth <= 640) {
      return 400; // made for mobile screens
    } else if (window.innerWidth <= 900) {
      return 756; // made for tablet screens
    } else if(window.innerWidth <= 1024){
      return 731; // I made it for larger screens
    } else{
      return 575; 
    }
  };

  return (
    <div className="card-wrapper">
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50"
        shadow={false}
      >
        <CardBody>
          <h2 className="mt-3 ml-3 text-left">{title}</h2>
          <Box className="w-full">
            <LineChart
              width={getWidth()}
              height={300}
              series={data}
              xAxis={[{ data: xLabels, scaleType: "point" }]}
              slotProps={{
                legend: { hidden: true },
              }}
            />
          </Box>
          <div className="gap-12 custom-legend-graph">
            {data.map((item, index) => (
              <div className="legend-item-graph" key={index}>
                <div
                  className="legend-color-graph"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="legend-label-graph">{item.label}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

Graph.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Graph;
