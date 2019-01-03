import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';

import { QueryParams } from './query-params';
import { QueryResult } from './query-result';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
// @Injectable()
export class HttpUtilsService {
  ///////////////////////////////////////////////
  getFindHttpParams(queryParams): HttpParams {
    const params = new HttpParams()
      .set('lastNamefilter', queryParams.filter)
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

  ///////////////////////////////////////////////
  baseFilter(
    items: any[],
    queryParams: QueryParams,
    filtrationFields: string[] = []
  ): QueryResult {
    // Filtering
    let itemsResult = this.searchInArray(
      items,
      queryParams.filter,
      filtrationFields
    );
    // Sorting
    if (queryParams.sortField) {
      itemsResult = this.sortArray(
        itemsResult,
        queryParams.sortField,
        queryParams.sortOrder
      );
    }
    // Pagination
    const totalCount = itemsResult.length;
    const initialPos = queryParams.pageNumber * queryParams.pageSize;
    itemsResult = itemsResult.slice(
      initialPos,
      initialPos + queryParams.pageSize
    );
    // Return queryResult
    const queryResult = new QueryResult();
    queryResult.items = itemsResult;
    queryResult.totalCount = totalCount;
    return queryResult;
  }

  ///////////////////////////////////////////////
  sortArray(
    incomingArray: any[],
    sortField: string = '',
    sortOrder: string = 'asc'
  ): any[] {
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

  ///////////////////////////////////////////////
  searchInArray(
    incomingArray: any[],
    queryObj: any,
    filtrationFields: string[] = []
  ): any[] {
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
}
