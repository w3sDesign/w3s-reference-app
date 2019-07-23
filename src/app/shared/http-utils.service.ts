import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';

import { QueryParams } from './query-params';
import { QueryResult } from './query-result';
import * as _ from 'lodash';
import { JsonPipe } from '@angular/common';
import { MessageService } from './message.service';

import * as moment from 'moment';
import { Moment } from 'moment';



@Injectable({ providedIn: 'root' })

export class HttpUtilsService {

  showTestValues = true;


  constructor(
    private messageService: MessageService
  ) { }


  ///////////////////////////////////////////////
  getFindHttpParams(queryParams): HttpParams {
    const params = new HttpParams()
      .set('filter', queryParams.filter)
      .set('sortOrder', queryParams.sortOrder)
      .set('sortField', queryParams.sortField)
      .set('pageNumber', queryParams.pageNumber.toString())
      .set('pageSize', queryParams.pageSize.toString());
    return params;
  }

  ///////////////////////////////////////////////
  getHttpHeaders(): HttpHeaders {
    const result = new HttpHeaders();
    result.set('Content-Type', 'application/json');
    return result;
  }



  createQueryResult(items: any[], queryParams: QueryParams): QueryResult {

    const queryResult = new QueryResult();

    const initialPos = queryParams.pageNumber * queryParams.pageSize;

    queryResult.items = items.slice(initialPos, initialPos + queryParams.pageSize);
    queryResult.totalCount = items.length;

    return queryResult;

  }



  /**
   * Filtering routine.
   * ##################################################################
   * For example:
   * items    :[{ "id"      : 20018,  "name"      : "XY Foundation" }, ...]
   * itemObj  : { "id"      : 20018,  "name"      : "XY Foundation" }
   * filters =
   * filterObj: { "idFilter": ">20010", "nameFilter": "Foundation" }
   */

  filterItems(items: any[], filterObj: any): any[] {

    if (!items || items.length === 0 || !filterObj) { return items; }

    this.logMessage(
      `[filterItems()] items[0] = \n ${JSON.stringify(items[0])}`
    );



    // const filterObj = filters;


    // ================================================================
    // JS array.filter() method that
    // returns an array of items that passed all filter tests
    // If a test fails -> return false.
    // ================================================================

    const filteredItems = items.filter(itemObj => {

      // LOOP1: For each itemObj (customer)
      // ==============================================================

      // Not needed? (filter testFailed === false). break instead!
      let testFailed = false;


      // forEach no break possible
      // Object.keys(filterObj).forEach(filterKey => {

      for (const filterKey of Object.keys(filterObj)) {

        // LOOP2: For each filterKey of the filterObj
        // ==============================================================
        // ('idFilter', 'nameFilter')

        const itemKey = filterKey.replace('Filter', ''); // 'id', 'name'

        const itemValue = itemObj[itemKey];

        if (!itemValue) { console.error('##########no itemValue! itemValue = ' + itemValue); }
        // console.log('#########itemKey: ' + itemKey);
        // console.log('#########itemValue: ' + JSON.stringify(itemValue));

        // TO DO TEST
        // if (!itemValue) { return false; }

        // If no filter continue LOOP2 with next filter ( in LOOP2).
        if (!filterObj[filterKey]) { continue; }

        const filterValue = filterObj[filterKey].trim().toLowerCase();


        // if (filterValue && testFailed === false) {


        if (typeof (itemValue) === 'string' &&
          moment(itemValue, ['YYYY-MM-DD', 'DD/MM/YYYY']).isValid()) {

          // Date Filter Tests
          // ==========================================================

          const itemDate = moment(itemValue, ['YYYY-MM-DD', 'DD/MM/YYYY']);
          // if (filterValue.substring(1) =)
          const filterDate = moment(filterValue, ['L', 'YYYY-MM-DD']);

          // console.log('#########itemDate: ' + itemDate);
          // console.log('#########filterDate: ' + filterDate);

          // switch (filterValue.substring(0, 1)) {
          //   case '>':
          //     if (itemDate < filterDate) { return false; }
          //     break;
          //   case '<':
          //     if (itemDate > filterDate) { return false; }
          //     break;
          //   case '=':
          //     if (itemDate !== filterDate) { return false; }
          //     break;

          //   // other tests ...

          //   default:
          // const filterDate0 = moment(filterValue, ['YYYY-MM-DD', 'DD/MM/YYYY']);

          // if (itemDate !== filterDate) { testFailed = true; break; }
          if (itemDate < filterDate || itemDate > filterDate) { testFailed = true; break; }
          // }


        } else if (typeof (itemValue) === 'string') {


          // String Filter Tests
          // ==========================================================


          // no itemValue.?
          // if (!itemValue) { testFailed = true; }
          if (!itemValue) { testFailed = true; break; }

          // filterValue does not exist.
          if (itemValue.toLowerCase().indexOf(filterValue) === -1) {
            testFailed = true;
            break;
          }

          // other tests ...


        } else if (typeof (itemValue) === 'number') {


          // Number Filter Tests
          // ==========================================================

          // ?
          if (!itemValue && itemValue !== 0) { testFailed = true; break; }

          switch (filterValue.substring(0, 1)) {
            case '>':
              if (itemValue <= +filterValue.substring(1)) { testFailed = true; }
              break;
            case '<':
              if (itemValue >= +filterValue.substring(1)) { testFailed = true; }
              break;
            case '=':
              if (itemValue !== +filterValue.substring(1)) { testFailed = true; }
              break;

            // other tests ...

            default:
              if (itemValue !== +filterValue) { testFailed = true; }
          }
          if (testFailed) { break; } // break LOOP2

        } else {

          console.log('######### empty else: ');

        }

        // Only string and numbers!!
        // customers AdditionalAddresses have itemValue = object array!
        // error => server returned undefined


        // } // End of LOOP2  // End of tests


      } // End of LOOP2 ==============================================================


      // If an itemObj has passed all tests (not failed) return true
      // to the items.filter(...) method; else return false.

      return !testFailed;



    }); // ################################################################



    // this.logMessage(
    //   `[filterItems()] filteredItems = \n ${JSON.stringify(filteredItems)}`
    // );

    return filteredItems;

  }



  /**
   * ##################################################################
   * Sorting routine.
   * ##################################################################
   */

  sortItems(data: any[], sortField: string, sortOrder: string): any[] {

    if (!data || data.length === 0 || !sortField) { return data; }


    const items = data.slice();
    const isAsc = sortOrder === 'asc';


    // if (moment(items[0][sortField], ['YYYY-MM-DD', 'DD/MM/YYYY']) instanceof moment) {

    this.logMessage(
      `[sortItems()] items[0] = \n ${JSON.stringify(items[0])}`
    );


    const isDate = (typeof items[0][sortField] === 'string' &&
      moment(items[0][sortField], ['YYYY-MM-DD', 'DD/MM/YYYY']).isValid());

    // moment(items[0][sortField], ['YYYY-MM-DD', 'DD/MM/YYYY']).isValid();

    const sortedItems = items.sort((a, b) => {
      // return items.sort((a, b) => {

      if (isDate) {
        return this.compareDate(
          moment(a[sortField], ['YYYY-MM-DD', 'DD/MM/YYYY']),
          moment(b[sortField], ['YYYY-MM-DD', 'DD/MM/YYYY']), isAsc);
      }

      return this.compare(a[sortField], b[sortField], isAsc);

      // if (a[sortField] < b[sortField]) {
      //   return sortOrder === 'asc' ? -1 : 1;
      // }

      // if (a[sortField] > b[sortField]) {
      //   return sortOrder === 'asc' ? 1 : -1;
      // }

      // return 0;

    });

    return sortedItems;
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareDate(a: Moment, b: Moment, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }





  /**
   * Client side searching.
   * ##################################################################
   *
   * @param items         The items (customers) array to be filtered and sorted.
   * @param queryParams   The params for searching (queryParams.searchTerm).
   *
   * @return queryResult  The searched items array.
   */

  // searchInAllFields(items: any[], queryParams: QueryParams): QueryResult {

  //   let searchedItems: any[] = items; // [];


  //   // ==================================================================
  //   // (1) Searching items.
  //   // ==================================================================

  //   if (queryParams.searchTerm) {

  //     searchedItems = this.searchItems(items, queryParams.searchTerm);

  //     this.logMessage(
  //       `[searchInAllFields()] searchedItems = \n ${JSON.stringify(searchedItems)}`
  //     );


  //   }


  //   // ================================================================
  //   // (2) Sorting searched items.
  //   // ================================================================

  //   if (queryParams.sortField) {

  //     searchedItems = this.sortItems(searchedItems, queryParams.sortField, queryParams.sortOrder);

  //   }


  //   // ================================================================
  //   // (3) Paginating searched (and sorted) items.
  //   // ================================================================

  //   const totalCount = searchedItems.length;
  //   const initialPos = queryParams.pageNumber * queryParams.pageSize;

  //   searchedItems = searchedItems.slice(initialPos, initialPos + queryParams.pageSize);


  //   // ================================================================
  //   // (4) Returning the queryResult.
  //   // ================================================================

  //   const queryResult = new QueryResult();

  //   queryResult.items = searchedItems;
  //   queryResult.totalCount = totalCount;

  //   return queryResult;


  // }




  /**
   * ##################################################################
   * Searching routine.
   * ##################################################################
   */

  searchItems(items: any[], term: string): any[] {

    const searchTerm = term.trim().toLowerCase();

    // ################################################################

    const searchedItems = items.filter(itemObj => { // JS array.filter() method

      let hasItemObjPassedTests = false;

      /**
       * For example:
       * itemObj = customer : { "id": "20018",  "name": "Vehicle Risus Foundation" }
       * searchTerm      : "found"
       */
      Object.keys(itemObj).forEach(key => {

        const itemValue = itemObj[key];
        let str: string;


        if (typeof (itemValue) === 'string') {

          str = itemValue.trim().toLowerCase();

          // if (this.showTestValues) {
          //   console.log('%c########## itemObj[key] [searchItems()] = \n' +
          //     JSON.stringify(itemObj[key]), 'color: darkgreen');

          //   console.log('%c########## let str [searchItems()] = \n' +
          //     JSON.stringify(str), 'color: darkgreen');
          // }

          if (str.indexOf(searchTerm) !== -1) {
            hasItemObjPassedTests = true;
          }

        }


        if (typeof (itemValue) === 'number') {

          str = itemValue.toString();

          if (str.indexOf(searchTerm) !== -1) {
            hasItemObjPassedTests = true;
          }

        }

        // Only string and numbers!!
        // customers AdditionalAddresses have itemValue = object array!
        // error => server returned undefined

      });

      // If an itemObj has passed the tests return true
      // to the array.filter method; else return false.
      return hasItemObjPassedTests;

    });

    // ################################################################

    this.logMessage(
      `[searchedItems()] searchedItems = \n ${JSON.stringify(searchedItems)}`
    );


    return searchedItems;


  }




  // ##################################################################
  // Helpers
  // ##################################################################


  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[http-utils.service.ts] ' + message);
  }

}










/**
 * Client side filtering and sorting.
 * ##################################################################
 *
 * @param items         The items (customers) array to be filtered and sorted.
 * @param queryParams   The params for filtering, sorting, and paginating.
 *
 * @return queryResult  The filtered and sorted items array.
 */

  // filterAndSort(items: any[], queryParams: QueryParams): QueryResult {

  //   let filteredItems: any[] = items.slice(); // [];
  //   let sortedItems: any[] = items.slice(); // [];

  //   // if (!queryParams.filter && !) {

  //   let data: any[];


  //   // ==================================================================
  //   // (1) Filtering items.
  //   // ==================================================================

  //   if (queryParams.filter) {

  //     filteredItems = this.filterItems(items, queryParams.filter);

  //     // this.logMessage(
  //     //   `[filterAndSort()] filteredItems = \n ${JSON.stringify(filteredItems)}`
  //     // );


  //   }


  //   // ================================================================
  //   // (2) Sorting filtered items.
  //   // ================================================================

  //   if (queryParams.sortField) {

  //     sortedItems = this.sortItems(filteredItems, queryParams.sortField, queryParams.sortOrder);

  //   }


  //   // ================================================================
  //   // (3) Paginating filtered (and sorted) items.
  //   // ================================================================

  //   // const totalCount = filteredItems.length;
  //   // const initialPos = queryParams.pageNumber * queryParams.pageSize;

  //   // filteredItems = filteredItems.slice(initialPos, initialPos + queryParams.pageSize);


  //   // ================================================================
  //   // (4) Returning the queryResult.
  //   // ================================================================

  //   const queryResult = new QueryResult();

  //   const initialPos = queryParams.pageNumber * queryParams.pageSize;

  //   queryResult.items = filteredItems.slice(initialPos, initialPos + queryParams.pageSize);
  //   queryResult.totalCount = filteredItems.length;

  //   return queryResult;


  // }






  // /**
  //  * ##################################################################
  //  * OLD Search Client side filtering.
  //  * ##################################################################
  //  */
  // arraySearch(
  //   incomingArray: any[],
  //   queryObj: any,
  //   filtrationFields: string[] = []): any[] {

  //   const result: any[] = [];
  //   let resultBuffer: any[] = [];
  //   const indexes: number[] = [];
  //   let firstIndexes: number[] = [];
  //   let doSearch = false;

  //   filtrationFields.forEach(item => {
  //     if (item in queryObj) {
  //       incomingArray.forEach((element, index) => {
  //         if (element[item] === queryObj[item]) {
  //           firstIndexes.push(index);
  //         }
  //       });
  //       firstIndexes.forEach(element => {
  //         resultBuffer.push(incomingArray[element]);
  //       });
  //       incomingArray = resultBuffer.slice(0);
  //       resultBuffer = [].slice(0);
  //       firstIndexes = [].slice(0);
  //     }
  //   });

  //   Object.keys(queryObj).forEach(key => {
  //     const searchText = queryObj[key]
  //       .toString()
  //       .trim()
  //       .toLowerCase();
  //     if (key && !_.includes(filtrationFields, key) && searchText) {
  //       doSearch = true;
  //       try {
  //         incomingArray.forEach((element, index) => {
  //           const val = element[key]
  //             .toString()
  //             .trim()
  //             .toLowerCase();
  //           if (
  //             val.indexOf(searchText) > -1 &&
  //             indexes.indexOf(index) === -1
  //           ) {
  //             indexes.push(index);
  //           }
  //         });
  //       } catch (ex) {
  //         console.log(ex, key, searchText);
  //       }
  //     }
  //   });

  //   if (!doSearch) {
  //     return incomingArray;
  //   }

  //   indexes.forEach(re => {
  //     result.push(incomingArray[re]);
  //   });

  //   return result;
  // }


// function isNumber(obj) {
//   return obj !== undefined && typeof (obj) === 'number' && !isNaN(obj);
// }

// For example, transform: 'customerPostalCode' to 'postalCode'.
// const itemKey = filterKey.replace(/([a-z]+)([A-Z])(\w+)/, '$2$3');
// For better performance:
// const itemKey = filterKey.replace(/^([a-z]+)([A-Z])/, (match, p1, p2) => p2.toLowerCase());
