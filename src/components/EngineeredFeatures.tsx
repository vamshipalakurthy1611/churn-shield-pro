import { motion } from "framer-motion";
import type { PredictionResult } from "@/services/churnPrediction";

interface EngineeredFeaturesProps {
  result: PredictionResult;
}

const EngineeredFeatures = ({ result }: EngineeredFeaturesProps) => {
  const features = [
    { label: 'Balance / Salary', value: result.engineeredFeatures.balanceToSalaryRatio.toFixed(2) },
    { label: 'Product Density', value: result.engineeredFeatures.productDensity.toFixed(2) },
    { label: 'Engagement', value: result.engineeredFeatures.engagementScore.toString() },
    { label: 'Age × Tenure', value: result.engineeredFeatures.ageTenureInteraction.toString() },
  ];

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-display uppercase tracking-wider text-muted-foreground mb-4">
        Engineered Features
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            className="bg-secondary/50 rounded-lg p-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="text-lg font-display font-bold text-foreground">{f.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{f.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EngineeredFeatures;
