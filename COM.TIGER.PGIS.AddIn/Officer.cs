using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IOfficer))]
    public class Officer:IFun.IOfficer
    {
        Dal.DOfficer _instance = new Dal.DOfficer();

        public int InsertEntity(Model.MOfficer e)
        {
            return _instance.AddEntity<Model.MOfficer>(e);
        }

        public int UpdateEntity(Model.MOfficer e)
        {
            return _instance.UpdateEntity<Model.MOfficer>(e);
        }

        public int DeleteEntities(params string[] ids)
        {
            return _instance.DeleteEntities<Model.MOfficer>(ids);
        }

        public Model.TotalClass<List<Model.MOfficer>> Page(int index, int size)
        {
            return _instance.PagingEntities<Model.MOfficer>(index, size);
        }


        public List<Model.MOfficer> GetEntities()
        {
            return _instance.GetEntities<Model.MOfficer>();
        }
    }
}
