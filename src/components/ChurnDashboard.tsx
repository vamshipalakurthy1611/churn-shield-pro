import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, TrendingUp, Zap } from "lucide-react";
import { type CustomerInput, DEFAULT_CUSTOMER, predictChurn } from "@/services/churnPrediction";
import CustomerInputPanel from "@/components/CustomerInputPanel";
import RiskGauge from "@/components/RiskGauge";
import FeatureImportanceChart from "@/components/FeatureImportanceChart";
import EngineeredFeatures from "@/components/EngineeredFeatures";
import WhatIfPanel from "@/components/WhatIfPanel";

const ChurnDashboard = () => {
  const [input, setInput] = useState<CustomerInput>(DEFAULT_CUSTOMER);
  const result = useMemo(() => predictChurn(input), [input]);

  const stats = [
    { icon: Activity, label: 'Probability', value: `${Math.round(result.churnProbability * 100)}%` },
    { icon: Shield, label: 'Prediction', value: result.exited ? 'CHURN' : 'RETAIN' },
    { icon: TrendingUp, label: 'Top Driver', value: result.featureContributions[0]?.feature || '-' },
    { icon: Zap, label: 'Engagement', value: result.engineeredFeatures.engagementScore.toString() },
  ];

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">ChurnShield</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Predictive Risk Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-display text-muted-foreground">Model Active</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <stat.icon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                <div className="text-sm font-display font-bold text-foreground">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Sidebar inputs */}
          <div className="lg:col-span-3 space-y-5">
            <CustomerInputPanel input={input} onChange={setInput} />
          </div>

          {/* Main content */}
          <div className="lg:col-span-5 space-y-5">
            <FeatureImportanceChart contributions={result.featureContributions} />
            <EngineeredFeatures result={result} />
          </div>

          {/* Right panel */}
          <div className="lg:col-span-4 space-y-5">
            <RiskGauge probability={result.churnProbability} riskCategory={result.riskCategory} />
            <WhatIfPanel baseInput={input} baseProb={result.churnProbability} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnDashboard;
