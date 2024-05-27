import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "@nextui-org/react";
import { PieChart } from "@mui/x-charts/PieChart";
import Box from '@mui/material/Box';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const StyledText = styled('text')(({ theme }) => ({
    fill: '#dedede',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
  }));
  
  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }

const PieChartCard = ({ title, data }) => {
  return (
    <div className="card-wrapper">
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50"
        shadow="sm"
      >
        <CardBody>
        <h2 className="mt-3 ml-3 text-left">{title}</h2>
          <Box sx={{ width: "100%" }}>
            <PieChart
              series={[
                {
                  data: data,
                  cx: "50%",
                  cy: "50%",
                  innerRadius: 93,
                  outerRadius: 127,
                },
              ]}
              height={300}
              slotProps={{
                legend: { hidden: true },
              }}>
              <PieCenterLabel>Center label</PieCenterLabel>
            </PieChart>
          </Box>{" "}
          <div className="custom-legend">
            {data.map((item, index) => (
              <div className="legend-item" key={index}>
                <div
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="legend-label">{item.label}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};


PieChartCard.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
      })
    ).isRequired,
  };
  
  export default PieChartCard;
  