using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Vega.Controllers.Resources;
using Vega.Extensions;
using Vega.Models;

namespace Vega.Persistence
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VegaDbContext context;
        public VehicleRepository(VegaDbContext context)
        {
            this.context = context;
        }
        public async Task<Vehicle> GetVehicle(int id, bool includeRelated = true)
        {
            if (!includeRelated)
                return await context.Vehicles.FindAsync(id);

            return await context.Vehicles
                                .Include(v => v.Features)
                                    .ThenInclude(vf => vf.Feature)
                                .Include(v => v.Model)
                                    .ThenInclude(m => m.Make)
                                .SingleOrDefaultAsync(v => v.Id == id);
        }

        public void Add(Vehicle vehicle)
        {
            context.Vehicles.Add(vehicle);
        }
        public void Delete(Vehicle vehicle)
        {
            context.Vehicles.Remove(vehicle);
        }

        public async Task<QueryResult<Vehicle>> GetVehicles(VehicleQuery queryObj)
        {
            var result = new QueryResult<Vehicle>();
            var query = context.Vehicles
                        .Include(v => v.Model)
                            .ThenInclude(m => m.Make)
                        .Include(v => v.Features)
                            .ThenInclude(vf => vf.Feature)
                        .AsQueryable();

            if (queryObj.MakeId.HasValue)
                query = query.Where(v => v.Model.MakeId == queryObj.MakeId.Value);
            var colunmMaps = new Dictionary<string, Expression<Func<Vehicle, object>>>
            {
                ["make"] = v => v.Model.Make.Name,
                ["model"] = v => v.Model.Name,
                ["contactName"] = v => v.ContactName
            };

            query = query.ApplyOrdering<Vehicle>(queryObj, colunmMaps);
            result.TotalItems = await query.CountAsync();
            query = query.ApplyPaging(queryObj);
            result.Items = await query.ToListAsync();

            return result;
        }

    }
}