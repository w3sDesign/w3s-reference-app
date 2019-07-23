export class QueryResult {
  items: any[] = [];
  totalCount = 0;
  errorMessage = '';
  /** Server-side or client-side filtering/sorting/paging. */
  clientSideQuerying = false;
}

// export class QueryResult {
//   items: any[];
//   totalCount: number;
//   errorMessage: string;

//   constructor(items: any[] = [], errorMessage: string = '') {
//     this.items = items;
//     this.totalCount = items.length;
//   }
// }
