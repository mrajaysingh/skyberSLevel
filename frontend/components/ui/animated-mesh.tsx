import { motion } from "framer-motion";

export function AnimatedMesh() {
  return (
    <div className="absolute inset-0 h-screen overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        initial={{ y: "-500%" }}
        animate={{ y: ["0%", "-100%"] }}
        transition={{ y: { duration: 100, repeat: Infinity, ease: "linear", repeatType: "loop" } }}
        style={{ height: "120%", width: "100%" }}
      />
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        initial={{ y: "0%" }}
        animate={{ y: ["100%", "0%"] }}
        transition={{ y: { duration: 100, repeat: Infinity, ease: "linear", repeatType: "loop" } }}
        style={{ height: "120%", width: "100%" }}
      />
    </div>
  );
}

