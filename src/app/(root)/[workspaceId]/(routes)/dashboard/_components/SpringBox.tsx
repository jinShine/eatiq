"use client";

import { useState } from "react";

import { motion } from "motion/react";

export default function SpringBox() {
  const [state, setState] = useState(false);

  return (
    <div className="example-container">
      <motion.div
        // drag="x"
        drag
        dragConstraints={{
          top: 0,
          left: 0,
          right: 50,
          bottom: 50,
        }}
        animate={{ translateX: state ? 100 : 0, transition: { duration: 0.5, bounce: 0.8, type: "spring" } }}
        initial={{ translateX: 0 }}
      >
        <div className="box bg-amber-400 size-10" />
      </motion.div>
      <button className="bg-amber-400" onClick={() => setState(!state)}>
        Toggle position
      </button>
    </div>
  );
}
