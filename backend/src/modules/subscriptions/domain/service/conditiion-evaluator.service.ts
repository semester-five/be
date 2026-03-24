import { Condition, ConditionRule } from '../value-objects/condition.vo';

export class ConditionEvaluator {
  evaluate(
    condition: Condition | null,
    params: Record<string, unknown>,
  ): boolean {
    if (!condition) return true;

    const results = condition.rules.map((rule) =>
      this.evaluateRule(rule, params),
    );

    return condition.logic === 'AND'
      ? results.every((r) => r)
      : results.some((r) => r);
  }

  private evaluateRule(
    rule: ConditionRule,
    params: Record<string, unknown>,
  ): boolean {
    const fieldValue: unknown = params[rule.field];

    switch (rule.operator) {
      case 'eq':
        return fieldValue === rule.value;
      case 'neq':
        return fieldValue !== rule.value;
      case 'gt':
        return this.compare(fieldValue, rule.value) > 0;
      case 'lt':
        return this.compare(fieldValue, rule.value) < 0;
      case 'gte':
        return this.compare(fieldValue, rule.value) >= 0;
      case 'lte':
        return this.compare(fieldValue, rule.value) <= 0;
      case 'nin':
        return Array.isArray(rule.value)
          ? !rule.value.includes(fieldValue)
          : true;
      case 'in':
        return Array.isArray(rule.value)
          ? rule.value.includes(fieldValue)
          : false;
      default:
        return false;
    }
  }

  private compare(left: unknown, right: unknown): number {
    if (typeof left === 'number' && typeof right === 'number') {
      return left - right;
    }

    if (typeof left === 'string' && typeof right === 'string') {
      return left.localeCompare(right);
    }

    return Number.NaN;
  }
}
