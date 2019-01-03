export class QueryResult {
  items: any[];
  totalCount: number;
  errorMessage: string;

  constructor(items: any[] = [], errorMessage: string = '') {
    this.items = items;
    this.totalCount = items.length;
  }
}
