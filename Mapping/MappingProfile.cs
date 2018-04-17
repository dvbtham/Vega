using System.Linq;
using AutoMapper;
using Vega.Controllers.Resources;
using Vega.Models;

namespace Vega.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Domain to API Resource
            CreateMap(typeof(QueryResult<>), typeof(QueryResultResource<>));
            CreateMap<Make, MakeResource>();
            CreateMap<Photo, PhotoResource>();
            CreateMap<Make, KeyValuePairResource>();
            CreateMap<Model, KeyValuePairResource>();
            CreateMap<Feature, KeyValuePairResource>();
            CreateMap<Vehicle, VehicleResource>()
            .ForMember(vr => vr.Make, opt => opt.MapFrom(m => m.Model.Make))
            .ForMember(vr => vr.Contact, opt => opt
                .MapFrom(v => new ContactResource
                {
                    Name = v.ContactName,
                    Phone = v.ContactPhone,
                    Email = v.ContactEmail
                }))
            .ForMember(vr => vr.Features, opt => opt.MapFrom(v => v.Features.Select(vf => new KeyValuePairResource { Id = vf.Feature.Id, Name = vf.Feature.Name })));

            // API Resource to Domain
            CreateMap<VehicleQueryResource, VehicleQuery>();
            CreateMap<SaveVehicleResource, Vehicle>()
            .ForMember(v => v.Id, opt => opt.Ignore())
            .ForMember(v => v.ContactName, opt => opt.MapFrom(vr => vr.Contact.Name))
            .ForMember(v => v.ContactPhone, opt => opt.MapFrom(vr => vr.Contact.Phone))
            .ForMember(v => v.ContactEmail, opt => opt.MapFrom(vr => vr.Contact.Email))
            .ForMember(v => v.Features, opt => opt.Ignore())
            .AfterMap((vr, v) =>
            {
                //Remove unselected features
                var removedFeatures = v.Features.Where(f => !vr.Features.Contains(f.FeatureId)).ToList();
                foreach (var f in removedFeatures)
                    v.Features.Remove(f);

                // Add new features
                var addedFeatures = vr.Features
                    .Where(id => !v.Features.Any(x => x.FeatureId == id))
                    .Select(id => new VehicleFeature { FeatureId = id }).ToList();

                foreach (var f in addedFeatures)
                    v.Features.Add(f);
            });
        }
    }
}