import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import type { CustomerInput } from "@/services/churnPrediction";

interface CustomerInputPanelProps {
  input: CustomerInput;
  onChange: (input: CustomerInput) => void;
}

const CustomerInputPanel = ({ input, onChange }: CustomerInputPanelProps) => {
  const update = (partial: Partial<CustomerInput>) => onChange({ ...input, ...partial });

  return (
    <div className="glass-card p-5 space-y-5">
      <h3 className="text-sm font-display uppercase tracking-wider text-muted-foreground">
        Customer Profile
      </h3>

      <div className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">Credit Score</Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[input.creditScore]}
              min={300} max={850} step={1}
              onValueChange={([v]) => update({ creditScore: v })}
              className="flex-1"
            />
            <span className="text-sm font-display w-10 text-right text-foreground">{input.creditScore}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Geography</Label>
            <Select value={input.geography} onValueChange={(v) => update({ geography: v as CustomerInput['geography'] })}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Spain">Spain</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Gender</Label>
            <Select value={input.gender} onValueChange={(v) => update({ gender: v as CustomerInput['gender'] })}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Age: {input.age}</Label>
          <Slider value={[input.age]} min={18} max={92} step={1} onValueChange={([v]) => update({ age: v })} />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Tenure: {input.tenure} years</Label>
          <Slider value={[input.tenure]} min={0} max={10} step={1} onValueChange={([v]) => update({ tenure: v })} />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Balance</Label>
          <Input
            type="number"
            value={input.balance}
            onChange={(e) => update({ balance: Number(e.target.value) })}
            className="bg-secondary border-border font-display"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Num of Products: {input.numOfProducts}</Label>
          <Slider value={[input.numOfProducts]} min={1} max={4} step={1} onValueChange={([v]) => update({ numOfProducts: v })} />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Estimated Salary</Label>
          <Input
            type="number"
            value={input.estimatedSalary}
            onChange={(e) => update({ estimatedSalary: Number(e.target.value) })}
            className="bg-secondary border-border font-display"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Has Credit Card</Label>
          <Switch checked={input.hasCrCard} onCheckedChange={(v) => update({ hasCrCard: v })} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Active Member</Label>
          <Switch checked={input.isActiveMember} onCheckedChange={(v) => update({ isActiveMember: v })} />
        </div>
      </div>
    </div>
  );
};

export default CustomerInputPanel;
