// src/Components/AccordionCard/index.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./index.css";
import { AccordionCardProps } from "./index.d";
import { HiChevronDown } from "react-icons/hi2";

const AccordionCard: React.FC<AccordionCardProps> = ({
  title,
  isOpen,
  onClick,
  children,
}) => {
  return (
    <div
      id="accordion-card"
      className={`${
        isOpen ? "border border-primary" : ""
      }  py-2 px-4 rounded-xl flex flex-col card centered-shadow cursor-default bg-background-lightest dark:bg-background-darkest text-text-darkest dark:text-text-lightest break-words transition-all duration-300`}
    >
      <div
        className="flex justify-between items-center text-lg font-bold py-2"
        onClick={onClick}
      >
        {title}
        <motion.span
          className={
            "rounded-full p-2 dark:hover:bg-background hover:bg-background-light"
          }
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <HiChevronDown />
        </motion.span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              height: "auto",
              opacity: [0, 1],
              transition: {
                height: {
                  type: "spring",
                  stiffness: 500,
                  damping: 18,
                  overshootClamping: false,
                },
                opacity: { duration: 0.3, delay: 0.3 },
              },
            }}
            exit={{
              opacity: [1, 0],
              height: 0,
              transition: {
                opacity: { duration: 0.2 },
                height: { duration: 0.2, delay: 0.2 },
              },
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionCard;
