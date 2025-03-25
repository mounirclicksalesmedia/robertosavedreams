export interface InvestmentOpportunity {
  id: string;
  title: string;
  targetAmount: string;
  currentRaise: string;
  description: string;
  icon: string;
  iconColor: string;
  highlights: string[];
  metrics: Record<string, string>;
}

export interface ProcessStep {
  title: string;
  description: string;
  icon: string;
}

export interface ImpactMetric {
  number: string;
  label: string;
  description: string;
}

export interface GrantsData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  overview: {
    title: string;
    description: string;
  };
  impactMetrics: {
    metrics: ImpactMetric[];
  };
  investmentOpportunities: InvestmentOpportunity[];
  investmentProcess: {
    title: string;
    steps: ProcessStep[];
  };
  grants: Array<{
    id: string;
    title: string;
    amount: string;
    deadline: string;
    description: string;
    icon: string;
    iconColor: string;
    requirements: string[];
  }>;
  applicationProcess: {
    title: string;
    steps: ProcessStep[];
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
} 