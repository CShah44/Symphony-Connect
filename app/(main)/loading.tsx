"use client";

import { motion } from "framer-motion";

const loading = () => {
  return (
    <div className="grid place-items-center h-screen font-agrandir">
      <motion.div
        animate={{ opacity: [0, 1] }}
        transition={{ repeat: Infinity, duration: 2, repeatType: "loop" }}
        className="font-melodrama text-7xl"
      >
        SYMPHONY <br />
        CONNECT
      </motion.div>
      Loading...
    </div>
  );
};

export default loading;
