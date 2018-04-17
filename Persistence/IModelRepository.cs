using System.Threading.Tasks;
using Vega.Models;

namespace Vega.Persistence
{
    public interface IModelRepository
    {
         Task<Model> GetModel(int id);
    }
}