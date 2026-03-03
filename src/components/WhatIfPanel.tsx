import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { type CustomerInput, predictChurn } from "@/services/churnPrediction";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface WhatIfPanelProps {
  baseInput: CustomerInput;
  baseProb: number;
}

const WhatIfPanel = ({ baseInput, baseProb }: WhatIfPanelProps) => {
  const [simInput, setSimInput] = useState<Partial<CustomerInput>>({});
  const merged = { ...baseInput, ...simInput };
  const simResult = useMemo(() => predictChurn(merged), [merged]);
  const delta = simResult.churnProbability - baseProb;
  const deltaPercent = Math.round(delta * 100);

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-display uppercase tracking-wider text-muted-foreground mb-1">
        What-If Simulation
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Adjust parameters to see impact on churn risk</p>

      <div className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">Products: {merged.numOfProducts}</Label>
          <Slider
            value={[merged.numOfProducts]}
            min={1} max={4} step={1}
            onValueChange={([v]) => setSimInput(prev => ({ ...prev, numOfProducts: v }))}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Balance: ${merged.balance.toLocaleString()}</Label>
          <Slider
            value={[merged.balance]}
            min={0} max={250000} step={1000}
            onValueChange={([v]) => setSimInput(prev => ({ ...prev, balance: v }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Active Member</Label>
          <Switch
            checked={merged.isActiveMember}
            onCheckedChange={(v) => setSimInput(prev => ({ ...prev, isActiveMember: v }))}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Credit Score: {merged.creditScore}</Label>
          <Slider
            value={[merged.creditScore]}
            min={300} max={850} step={1}
            onValueChange={([v]) => setSimInput(prev => ({ ...prev, creditScore: v }))}
          />
        </div>
      </div>

      <motion.div
        className="mt-5 p-4 rounded-lg bg-secondary/50 text-center"
        key={deltaPercent}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Simulated Change</div>
        <div className="flex items-center justify-center gap-2">
          {delta > 0.005 ? (
            <ArrowUp className="w-5 h-5 text-destructive" />
          ) : delta < -0.005 ? (
            <ArrowDown className="w-5 h-5 text-primary" />
          ) : (
            <Minus className="w-5 h-5 text-muted-foreground" />
          )}
          <span className={`text-2xl font-display font-bold ${
            delta > 0.005 ? 'text-destructive' : delta < -0.005 ? 'text-primary' : 'text-muted-foreground'
          }`}>
            {delta > 0 ? '+' : ''}{deltaPercent}%
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          New probability: {Math.round(simResult.churnProbability * 100)}% ({simResult.riskCategory})
        </div>
      </motion.div>
    </div>
  );
};

export default WhatIfPanel;
