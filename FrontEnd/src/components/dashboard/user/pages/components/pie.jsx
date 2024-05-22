import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "@nextui-org/react";
import { PieChart } from "@mui/x-charts/PieChart";

const PieChartCard = ({ title, data }) => {
  return (
    <div className="card-wrapper">
      <Card
        isBlurred
        className="border-none bg-background/15 white:bg-default-100/50"
        shadow="sm"
      >
        <CardBody>
          <h2 className="text-left">{title}</h2>
          <PieChart
            series={[
              {
                data: data,
                cx: "50%",
                cy: "50%",
                innerRadius: 40,
                outerRadius: 80,
              },
            ]}
            height={250}
            width={390}
            slotProps={{
              legend: { hidden: true },
            }}
          />
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
