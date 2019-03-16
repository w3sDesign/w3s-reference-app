import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';

import { QueryParams } from './query-params';
import { QueryResult } from './query-result';
import * as _ from 'lodash';

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
   * ##################################################################
   * Client side filtering, sorting, and pagination.
   * ##################################################################
   */
  query(items: any[], queryParams: QueryParams): QueryResult {

    let filteredItems: any[] = items;
    const filterTemplate = queryParams.filter;

    let notPassedTests = 0;
    let hasPassedTests = true;

    // function isNumber(obj) {
    //   return obj !== undefined && typeof (obj) === 'number' && !isNaN(obj);
    // }

    // function filterByID(item) {
    //   if (isNumber(item.id) && item.id !== 0) {
    //     return true;
    //   }
    //   invalidEntries++;
    //   return false;
    // }

    // const arrByID = items.filter(filterByID);



    /**
     * Returns only items that pass all tests (filter criteria).
     */
    filteredItems = items.filter(item => {

      notPassedTests = 0;
      hasPassedTests = true;

      Object.keys(filterTemplate).forEach(key => { // key = 'customerId', 'customerName', ...

        if (filterTemplate[key]) {

          // Transform for example: key = 'customerId' to itemKey = 'id'.
          // const itemKey = key.replace(/([a-z]+)([A-Z])(\w+)/, '$2$3');
          let itemKey = key.replace(/^([a-z]+)([A-Z])/, (match, p1, p2) => p2.toLowerCase());

          if (typeof (item[itemKey]) === 'number') {

            if (filterTemplate[key].substring(0, 1) === '>') {
              if (item[itemKey] < +filterTemplate[key].substring(1)) {
                hasPassedTests = false;
              }
            } else if (filterTemplate[key].substring(0, 1) === '<') {
              if (item[itemKey] > +filterTemplate[key].substring(1)) {
                hasPassedTests = false;
              }
            } else
              if (item[itemKey] !== +filterTemplate[key]) {
                hasPassedTests = false;
              }
          } else

            if (typeof (item[itemKey]) === 'string') {

              if (item[itemKey].toLowerCase().indexOf(filterTemplate[key].toLowerCase()) === -1) {
                hasPassedTests = false;
              }

              // other tests ...
            }
        }
      });

      // If item has passed all tests (filter criteria) return true.
      // if (notPassedTests > 0) { return false; } else { return true; }
      return hasPassedTests;

    });



    //   filterString = filterObj[key]
    //     .toString()
    //     .trim()
    //     .toLowerCase();

    //   if (key && !_.includes(filtrationFields, key) && searchText) {
    //     doSearch = true;
    //     try {
    //       incomingArray.forEach((element, index) => {
    //         const val = element[key]
    //           .toString()
    //           .trim()
    //           .toLowerCase();
    //         if (
    //           val.indexOf(searchText) > -1 &&
    //           indexes.indexOf(index) === -1
    //         ) {
    //           indexes.push(index);
    //         }
    //       });
    //     } catch (ex) {
    //       console.log(ex, key, searchText);
    //     }
    //   }
    // });





    /** Sorting */
    if (queryParams.sortField) {
      filteredItems = this.arraySort(
        filteredItems,
        queryParams.sortField,
        queryParams.sortOrder
      );
    }

    /** Pagination */
    const totalCount = filteredItems.length;
    const initialPos = queryParams.pageNumber * queryParams.pageSize;
    filteredItems = filteredItems.slice(
      initialPos,
      initialPos + queryParams.pageSize
    );

    /** Return queryResult */
    const queryResult = new QueryResult();
    queryResult.items = filteredItems;
    queryResult.totalCount = totalCount;
    return queryResult;
  }

  // queryOriginal(
  //   items: any[],
  //   queryParams: QueryParams,
  //   filtrationFields: string[] = []): QueryResult {

  //   /** Filtering */
  //   let itemsResult = this.arraySearch(
  //     items,
  //     queryParams.filter,
  //     filtrationFields
  //   );

  //   /** Sorting */
  //   if (queryParams.sortField) {
  //     itemsResult = this.arraySort(
  //       itemsResult,
  //       queryParams.sortField,
  //       queryParams.sortOrder
  //     );
  //   }

  //   /** Pagination */
  //   const totalCount = itemsResult.length;
  //   const initialPos = queryParams.pageNumber * queryParams.pageSize;
  //   itemsResult = itemsResult.slice(
  //     initialPos,
  //     initialPos + queryParams.pageSize
  //   );

  //   /** Return queryResult */
  //   const queryResult = new QueryResult();
  //   queryResult.items = itemsResult;
  //   queryResult.totalCount = totalCount;
  //   return queryResult;
  // }


  /**
   * ##################################################################
   * Client side filtering.
   * ##################################################################
   */
  arraySearch(
    incomingArray: any[],
    queryObj: any,
    filtrationFields: string[] = []): any[] {

    const result: any[] = [];
    let resultBuffer: any[] = [];
    const indexes: number[] = [];
    let firstIndexes: number[] = [];
    let doSearch = false;

    filtrationFields.forEach(item => {
      if (item in queryObj) {
        incomingArray.forEach((element, index) => {
          if (element[item] === queryObj[item]) {
            firstIndexes.push(index);
          }
        });
        firstIndexes.forEach(element => {
          resultBuffer.push(incomingArray[element]);
        });
        incomingArray = resultBuffer.slice(0);
        resultBuffer = [].slice(0);
        firstIndexes = [].slice(0);
      }
    });

    Object.keys(queryObj).forEach(key => {
      const searchText = queryObj[key]
        .toString()
        .trim()
        .toLowerCase();
      if (key && !_.includes(filtrationFields, key) && searchText) {
        doSearch = true;
        try {
          incomingArray.forEach((element, index) => {
            const val = element[key]
              .toString()
              .trim()
              .toLowerCase();
            if (
              val.indexOf(searchText) > -1 &&
              indexes.indexOf(index) === -1
            ) {
              indexes.push(index);
            }
          });
        } catch (ex) {
          console.log(ex, key, searchText);
        }
      }
    });

    if (!doSearch) {
      return incomingArray;
    }

    indexes.forEach(re => {
      result.push(incomingArray[re]);
    });

    return result;
  }


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

}
