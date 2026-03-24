export type ConditionOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'in'
  | 'nin';

export interface ConditionRule {
  field: string;
  operator: ConditionOperator;
  value: any;
}

export interface Condition {
  logic?: 'AND' | 'OR';
  rules: ConditionRule[];
}
