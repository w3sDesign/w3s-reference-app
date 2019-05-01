import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';

import { QueryParams } from './query-params';
import { QueryResult } from './query-result';
import * as _ from 'lodash';
import { JsonPipe } from '@angular/common';


@Injectable({ providedIn: 'root' })

export class HttpUtilsService {


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


  /**
   * ## @method filterAndSort()
   * ##################################################################
   * - Client side filtering and sorting.
   *
   * @param items         The items (customers) array to be filtered and sorted.
   * @param queryParams   The params for filtering, sorting, and paginating.
   *
   * @return queryResult  The filtered and sorted items array.
   */

  filterAndSort(items: any[], queryParams: QueryParams): QueryResult {

    // ==================================================================
    // (1) Filtering - setting filtered items.
    // ==================================================================

    /** Filtered items have passed all filter tests. */
    let filteredItems: any[];

    const filterTemplate = queryParams.filter;

    filteredItems = items.filter(item => { // JS array.filter() method

      let testFailed = false;

      /**
       * For example:
       * item          : { "id"      : "20018",  "name"      : "Vehicle Risus Foundation" }
       * filterTemplate: { "idFilter": ">20010", "nameFilter": "Foundation" }
       *
       * For each key in the filter template object ('idFilter', 'nameFilter').
       */
      Object.keys(filterTemplate).forEach(filterKey => {

        const itemKey = filterKey.replace('Filter', '');

        const value = item[itemKey];

        if (!value) { console.error('##########no value! value = ' + value); }
        // console.log('#########itemKey: ' + itemKey);
        // console.log('#########value: ' + JSON.stringify(value));

        const filter = filterTemplate[filterKey].trim().toLowerCase();

        if (filter && !testFailed) {

          if (typeof (value) === 'string') {

            if (value.toLocaleLowerCase().indexOf(filter) === -1) {
              testFailed = true;
            }

          }

          if (typeof (value) === 'number') {

            switch (filter.substring(0, 1)) {
              case '>':
                if (value <= +filter.substring(1)) { testFailed = true; }
                break;
              case '<':
                if (value >= +filter.substring(1)) { testFailed = true; }
                break;
              case '=':
                if (value !== +filter.substring(1)) { testFailed = true; }
                break;
              default:
                if (value !== +filter) { testFailed = true; }
            }

          }

          // other tests ...
        }

      });

      // If an item has passed all filter tests (not failed) return true
      // to the array.filter method; else return false.
      return !testFailed;

    });


    // ================================================================
    // (2) Sorting filtered items.
    // ================================================================

    if (queryParams.sortField) {
      filteredItems = this.arraySort(
        filteredItems,
        queryParams.sortField,
        queryParams.sortOrder
      );
    }


    // ================================================================
    // (3) Paginating filtered (and sorted) items.
    // ================================================================

    const totalCount = filteredItems.length;
    const initialPos = queryParams.pageNumber * queryParams.pageSize;
    filteredItems = filteredItems.slice(
      initialPos,
      initialPos + queryParams.pageSize
    );


    // ================================================================
    // (4) Returning the queryResult.
    // ================================================================

    const queryResult = new QueryResult();

    queryResult.items = filteredItems;

    queryResult.totalCount = totalCount;

    // console.log('##########http-utils-service / queryResult: ' + JSON.stringify(queryResult));

    return queryResult;


  } // The end of filterAndSort().



  /**
   * ##################################################################
   * Client side sorting.
   * ##################################################################
   */
  arraySort(
    incomingArray: any[],
    sortField: string = '',
    sortOrder: string = 'asc'): any[] {

    if (!sortField) {
      return incomingArray;
    }

    let result: any[] = [];
    result = incomingArray.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortOrder === 'asc' ? -1 : 1;
      }

      if (a[sortField] > b[sortField]) {
        return sortOrder === 'asc' ? 1 : -1;
      }

      return 0;
    });
    return result;
  }


} // The end.


  // /**
  //  * ##################################################################
  //  * OLD Client side filtering.
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
