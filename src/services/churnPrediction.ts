/**
 * Churn Prediction Service
 * 
 * This module provides a mock prediction engine that simulates a logistic regression model.
 * Replace the `predictChurn` function body with a real API call to your Python backend.
 * 
 * Expected API endpoint: POST /predict
 * Request body: CustomerInput
 * Response: PredictionResult
 */

export interface CustomerInput {
  creditScore: number;
  geography: 'France' | 'Spain' | 'Germany';
  gender: 'Male' | 'Female';
  age: number;
  tenure: number;
  balance: number;
  numOfProducts: number;
  hasCrCard: boolean;
  isActiveMember: boolean;
  estimatedSalary: number;
}

export interface FeatureContribution {
  feature: string;
  importance: number;
  direction: 'increases' | 'decreases';
}

export interface PredictionResult {
  churnProbability: number;
  riskCategory: 'Low' | 'Medium' | 'High';
  exited: 0 | 1;
  featureContributions: FeatureContribution[];
  engineeredFeatures: {
    balanceToSalaryRatio: number;
    productDensity: number;
    engagementScore: number;
    ageTenureInteraction: number;
  };
}

export const DEFAULT_CUSTOMER: CustomerInput = {
  creditScore: 650,
  geography: 'France',
  gender: 'Female',
  age: 35,
  tenure: 5,
  balance: 76000,
  numOfProducts: 1,
  hasCrCard: true,
  isActiveMember: true,
  estimatedSalary: 50000,
};

// Simulated model coefficients (mimics trained logistic regression)
const COEFFICIENTS: Record<string, number> = {
  creditScore: -0.0007,
  age: 0.073,
  tenure: -0.016,
  balance: 0.000002,
  numOfProducts: -0.1,
  hasCrCard: -0.015,
  isActiveMember: -0.98,
  estimatedSalary: -0.000001,
  geography_Germany: 0.78,
  geography_Spain: 0.04,
  gender_Male: 0.53,
  balanceToSalaryRatio: 0.15,
  productDensity: 0.35,
  engagementScore: -0.45,
  ageTenureInteraction: 0.002,
};
const INTERCEPT = -3.5;

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function getRiskCategory(probability: number, thresholds = { low: 0.3, high: 0.7 }): 'Low' | 'Medium' | 'High' {
  if (probability < thresholds.low) return 'Low';
  if (probability < thresholds.high) return 'Medium';
  return 'High';
}

/**
 * Predict churn for a customer.
 * 
 * TO CONNECT TO REAL API:
 * Replace the body of this function with:
 * ```
 * const response = await fetch('YOUR_API_URL/predict', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(input),
 * });
 * return await response.json();
 * ```
 */
export function predictChurn(input: CustomerInput, threshold = 0.5): PredictionResult {
  // Engineered features
  const balanceToSalaryRatio = input.estimatedSalary > 0 ? input.balance / input.estimatedSalary : 0;
  const productDensity = input.numOfProducts / (input.tenure + 1);
  const engagementScore = (input.isActiveMember ? 1 : 0) * input.numOfProducts;
  const ageTenureInteraction = input.age * input.tenure;

  // Compute logit
  let logit = INTERCEPT;
  logit += COEFFICIENTS.creditScore * input.creditScore;
  logit += COEFFICIENTS.age * input.age;
  logit += COEFFICIENTS.tenure * input.tenure;
  logit += COEFFICIENTS.balance * input.balance;
  logit += COEFFICIENTS.numOfProducts * input.numOfProducts;
  logit += COEFFICIENTS.hasCrCard * (input.hasCrCard ? 1 : 0);
  logit += COEFFICIENTS.isActiveMember * (input.isActiveMember ? 1 : 0);
  logit += COEFFICIENTS.estimatedSalary * input.estimatedSalary;
  logit += COEFFICIENTS.geography_Germany * (input.geography === 'Germany' ? 1 : 0);
  logit += COEFFICIENTS.geography_Spain * (input.geography === 'Spain' ? 1 : 0);
  logit += COEFFICIENTS.gender_Male * (input.gender === 'Male' ? 1 : 0);
  logit += COEFFICIENTS.balanceToSalaryRatio * balanceToSalaryRatio;
  logit += COEFFICIENTS.productDensity * productDensity;
  logit += COEFFICIENTS.engagementScore * engagementScore;
  logit += COEFFICIENTS.ageTenureInteraction * ageTenureInteraction;

  const churnProbability = Math.min(Math.max(sigmoid(logit), 0.01), 0.99);

  // Feature contributions for explainability
  const geoDir: FeatureContribution['direction'] = input.geography === 'Germany' ? 'increases' : 'decreases';
  const genderDir: FeatureContribution['direction'] = input.gender === 'Male' ? 'increases' : 'decreases';

  const contributions = ([
    { feature: 'Age', importance: Math.abs(COEFFICIENTS.age * input.age), direction: 'increases' as const },
    { feature: 'Active Member', importance: Math.abs(COEFFICIENTS.isActiveMember * (input.isActiveMember ? 1 : 0)), direction: 'decreases' as const },
    { feature: 'Geography', importance: Math.abs(COEFFICIENTS.geography_Germany * (input.geography === 'Germany' ? 1 : 0)), direction: geoDir },
    { feature: 'Gender', importance: Math.abs(COEFFICIENTS.gender_Male * (input.gender === 'Male' ? 1 : 0)), direction: genderDir },
    { feature: 'Balance', importance: Math.abs(COEFFICIENTS.balance * input.balance), direction: 'increases' as const },
    { feature: 'Credit Score', importance: Math.abs(COEFFICIENTS.creditScore * input.creditScore), direction: 'decreases' as const },
    { feature: 'Engagement Score', importance: Math.abs(COEFFICIENTS.engagementScore * engagementScore), direction: 'decreases' as const },
    { feature: 'Products', importance: Math.abs(COEFFICIENTS.numOfProducts * input.numOfProducts), direction: 'decreases' as const },
    { feature: 'Tenure', importance: Math.abs(COEFFICIENTS.tenure * input.tenure), direction: 'decreases' as const },
    { feature: 'Salary', importance: Math.abs(COEFFICIENTS.estimatedSalary * input.estimatedSalary), direction: 'decreases' as const },
  ] satisfies FeatureContribution[]).sort((a, b) => b.importance - a.importance);

  return {
    churnProbability,
    riskCategory: getRiskCategory(churnProbability),
    exited: churnProbability >= threshold ? 1 : 0,
    featureContributions: contributions,
    engineeredFeatures: {
      balanceToSalaryRatio: Math.round(balanceToSalaryRatio * 100) / 100,
      productDensity: Math.round(productDensity * 100) / 100,
      engagementScore,
      ageTenureInteraction,
    },
  };
}
