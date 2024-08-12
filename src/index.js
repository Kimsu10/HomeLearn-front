import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import "./styles/reset.css";
import "./styles/base.css";
import "./styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Router />);