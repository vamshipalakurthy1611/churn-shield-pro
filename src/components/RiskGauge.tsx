import { motion } from "framer-motion";

interface RiskGaugeProps {
  probability: number;
  riskCategory: 'Low' | 'Medium' | 'High';
}

const RiskGauge = ({ probability, riskCategory }: RiskGaugeProps) => {
  const percentage = Math.round(probability * 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (probability * 0.75 * circumference);

  const riskColor = riskCategory === 'Low'
    ? 'hsl(var(--risk-low))'
    : riskCategory === 'Medium'
      ? 'hsl(var(--risk-medium))'
      : 'hsl(var(--risk-high))';

  const glowClass = riskCategory === 'Low'
    ? 'glow-risk-low'
    : riskCategory === 'Medium'
      ? 'glow-risk-medium'
      : 'glow-risk-high';

  const riskTextColor = riskCategory === 'Low'
    ? 'text-risk-low'
    : riskCategory === 'Medium'
      ? 'text-risk-medium'
      : 'text-risk-high';

  return (
    <div className={`glass-card p-6 flex flex-col items-center ${glowClass}`}>
      <h3 className="text-sm font-display uppercase tracking-wider text-muted-foreground mb-4">
        Churn Risk Score
      </h3>
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={riskColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-3xl font-display font-bold ${riskTextColor}`}
            key={percentage}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      <motion.div
        className={`mt-3 px-4 py-1.5 rounded-full text-xs font-display font-semibold uppercase tracking-wider ${
          riskCategory === 'Low' ? 'bg-risk-low/15 text-risk-low' :
          riskCategory === 'Medium' ? 'bg-risk-medium/15 text-risk-medium' :
          'bg-risk-high/15 text-risk-high'
        }`}
        key={riskCategory}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {riskCategory} Risk
      </motion.div>
    </div>
  );
};

export default RiskGauge;
