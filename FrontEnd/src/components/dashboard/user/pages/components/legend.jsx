import React from "react";
import PropTypes from "prop-types";

const Legend = ({ items }) => {
  return (
    <div className="custom-legend">
      {items.map((item, index) => (
        <div className="legend-item" key={index}>
          <div
            className="legend-color"
            style={{ backgroundColor: item.color }}
          ></div>
          <div className="legend-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

Legend.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Legend;
