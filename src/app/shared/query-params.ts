export class QueryParams {
  filter: any = {};
  sortOrder: 'asc' | 'desc' | '' = 'asc';
  sortField = '';
  pageNumber = 0;
  pageSize = 10;
}

// export class QueryParams {
//   filter: any;
//   sortOrder: string; // asc/desc
//   sortField: string;
//   pageNumber: number;
//   pageSize: number;

//   // Constructor defaults.
//   constructor(
//     filter: any,
//     sortOrder: string = "asc",
//     sortField: string = "",
//     pageNumber: number = 0,
//     pageSize: number = 10
//   ) {
//     this.filter = filter;
//     this.sortOrder = sortOrder;
//     this.sortField = sortField;
//     this.pageNumber = pageNumber;
//     this.pageSize = pageSize;
//   }
// }
