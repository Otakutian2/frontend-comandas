import React from "react";
import styles from "./css/loader-style.module.css";

const LoaderCustom = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default LoaderCustom;
