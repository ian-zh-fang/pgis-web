using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IAdministrative))]
    public class Administrative:IFun.IAdministrative
    {
        Dal.DAdministrative _instance = new Dal.DAdministrative();

        public Model.TotalClass<List<Model.MAdministrative>> Pagging(int index, int size)
        {
            return _instance.PagingEntities<Model.MAdministrative>(index, size);
        }

        public int AddEntity(Model.MAdministrative e)
        {
            return _instance.AddEntity<Model.MAdministrative>(e);
        }

        public int UpdateEntity(Model.MAdministrative e)
        {
            return _instance.UpdateEntity<Model.MAdministrative>(e);
        }

        public int DeleteEntities(params string[] ids)
        {
            return _instance.DeleteEntities<Model.MAdministrative>(ids);
        }
        
        public Model.TotalClass<List<Model.MAdministrative>> PageTop(int index, int size)
        {
            return _instance.PageTop(index, size);
        }

        public Model.TotalClass<List<Model.MAdministrative>> PageSub(int id, int index, int size)
        {
            return _instance.PageSub(id, index, size);
        }
        
        public List<Model.MAdministrative> GetAdministrativeTree()
        {
            return _instance.GetAdministrativeTree();
        }
    }
}
