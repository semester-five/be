export interface IRenderContentService {
  render(content: string, params: Record<string, any>): string;

  validate(content: string): boolean;
}
