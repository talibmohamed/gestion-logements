import * as React from "react";
const NoBalcony = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    aria-hidden="true"
    role="presentation"
    focusable="false"
    style={{
        display: "block",
        height: 24,
        width: 24,
        fill: "currentcolor",
      }}
    {...props}
  >
    <path d="M23 1a2 2 0 0 1 2 1.85V19h4v2h-2v8h2v2H3v-2h2v-8H3v-2h4V3a2 2 0 0 1 1.85-2H9zM9 21H7v8h2zm4 0h-2v8h2zm4 0h-2v8h2zm4 0h-2v8h2zm4 0h-2v8h2zm-10-8H9v6h6zm8 0h-6v6h6zM15 3H9v8h6zm8 0h-6v8h6z" />
    <path d="M4 1l29 35" stroke="currentColor" strokeWidth={2} />
  </svg>
);
export default NoBalcony;