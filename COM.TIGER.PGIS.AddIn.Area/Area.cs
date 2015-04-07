using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.Area
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IArea))]
    public partial class Area:IFun.IArea
    {
        private Dal.DArea _area = new Dal.DArea();

        public object[] All()
        {
            return new object[] { 
                new {},
                new {},
                new {}
            };
        }


        public Model.TotalClass<List<Model.MArea>> GetAreaForPage(string level, int p, int limit)
        {
            return new Model.TotalClass<List<Model.MArea>>();
        }


        public int InsertEntity<T>(T t)
        {
            return _area.AddEntity<T>(t);
        }

        public int UpdateEntity<T>(T t)
        {
            return _area.UpdateEntity<T>(t);
        }

        public int DeleteEntities<T>(params string[] ids)
        {
            return _area.DeleteEntities<T>(ids);
        }

        public List<Model.MBelongTo> GetBelongTos(params string[] ids)
        {
            return _area.GetBelongTos(ids);
        }

        public Model.TotalClass<List<Model.MBelongTo>> PagingBelongTo(int index, int size)
        {
            return _area.PagingBelongTo(index, size);
        }


        public Model.TotalClass<List<Model.MArea>> PagingTopArea(int index, int size)
        {
            return _area.PagingTopArea(index, size);
        }

        public Model.TotalClass<List<Model.MArea>> PagingChildArea(int pid, int index, int size)
        {
            return _area.PagingChildArea(pid, index, size);
        }


        public List<Model.MAreaRange> GetRanges(int areaid)
        {
            return _area.GetRanges(areaid);
        }


        public List<Model.MArea> GetAreasTree()
        {
            return _area.GetAreasTree();
        }
    }
}
