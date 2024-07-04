import React, { useRef, useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { LineChart } from "@mui/x-charts/LineChart";
import PropTypes from "prop-types";

const Graph = ({ title, data, xLabels }) => {
  const cardRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const updateChartWidth = () => {
      if (cardRef.current) {
        setChartWidth(cardRef.current.clientWidth);
      }
    };

    // Initial width set
    updateChartWidth();

    // Update width on resize
    window.addEventListener("resize", updateChartWidth);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateChartWidth);
    };
  }, []);

  return (
    <div className="card-wrapper" ref={cardRef} style={{ width: '100%' }}>
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50"
        shadow={false}
        style={{ width: '100%' }}
      >
        <CardBody style={{ width: '100%' }}>
          <h2 className="mt-3 ml-3 text-left">{title}</h2>
          <div className="w-full">
            <LineChart
              width={chartWidth} 
              height={300}
              series={data}
              xAxis={[{ data: xLabels, scaleType: "point" }]}
              slotProps={{
                legend: { hidden: true },
              }}
            />
          </div>
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
  xLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Graph;