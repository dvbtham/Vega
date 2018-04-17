using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Vega.Models;

namespace Vega.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> query, IQueryObject queryObj, Dictionary<string, Expression<Func<T, object>>> colunmMaps)
        {

            if (String.IsNullOrWhiteSpace(queryObj.SortBy) || !colunmMaps.ContainsKey(queryObj.SortBy)) return query;

            if (queryObj.IsSortAscending)
                return query.OrderBy(colunmMaps[queryObj.SortBy]);
            else
                return query.OrderByDescending(colunmMaps[queryObj.SortBy]);
        }

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, IQueryObject queryObj)
        {
            if (queryObj.Page <= 0) queryObj.Page = 1;
            if (queryObj.PageSize <= 0) queryObj.PageSize = 10;
            return query.Skip((queryObj.Page - 1) * queryObj.PageSize).Take(queryObj.PageSize);
        }
    }
}