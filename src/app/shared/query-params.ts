export class QueryParams {
  // filterTemplateName = '';
  filterTemplateId = 0;
  filter: any = ''; // = {};
  searchTerm = '';  // searching in all fields

  sortField = 'id';
  sortOrder: 'asc' | 'desc' | '' = 'asc';

  pageNumber = 0;
  pageSize = 10;

  questions: {}[] = [];
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
