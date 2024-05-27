import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Box } from "@mui/material";  // Add this import
import { LineChart } from "@mui/x-charts/LineChart";
import PropTypes from "prop-types";


// const xLabels = ["Jan", "Fev", "Mar", "Avr", "May", "Jui"];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
  ];

const Graph = ({ title, data }) => {
  return (
    <div className="card-wrapper">
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50"
        shadow={false}
      >
        <CardBody>
          <h2 className="mt-3 ml-3 text-left">{title}</h2>
          <Box sx={{ width: "100%" }}>
            <LineChart
              width={500}
              height={300}
              series={data}
              xAxis={[{ scaleType: "point", data: xLabels }]}
            />
          </Box>
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
