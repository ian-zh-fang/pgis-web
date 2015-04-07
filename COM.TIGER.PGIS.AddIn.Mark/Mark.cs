using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.Mark
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IMark))]
    public class Mark:IFun.IMark
    {
        public List<COM.TIGER.PGIS.Model.MMark> GetMarks(params string[] ids)
        {
            return (new Dal.DMark()).GetMarks(ids);
        }

        public COM.TIGER.PGIS.Model.TotalClass<List<COM.TIGER.PGIS.Model.MMark>> PagingMarks(int index, int size)
        {
            return (new Dal.DMark()).PagingEntities<Model.MMark>(index, size);
        }

        public int InsertEntity(COM.TIGER.PGIS.Model.MMark e)
        {
            return (new Dal.DMark()).AddEntity<Model.MMark>(e);
        }

        public int UpdateEntity(COM.TIGER.PGIS.Model.MMark e)
        {
            return (new Dal.DMark()).UpdateEntity<Model.MMark>(e);
        }

        public int DeleteEntities(params string[] ids)
        {
            return (new Dal.DMark()).DeleteEntities<Model.MMark>(ids);
        }

        //public List<Model.MMark> GetMarkRangeTree()
        //{
        //    return (new Dal.DMark()).GetMarksTree() as List<model.>;
        //}

        public List<Model.MMarkEx> GetMarksTree()
        {
            return (new Dal.DMark()).GetMarksTree();
        }
        
        public List<Model.MMarkType> GetMarkTypes(params string[] ids)
        {
            return (new Dal.DMark()).GetMarkTypes(ids);
        }

        public int InsertMarkType(Model.MMarkType e)
        {
            return (new Dal.DMark()).AddEntity<Model.MMarkType>(e);
        }

        public int UpdateMarkType(Model.MMarkType e)
        {
            return (new Dal.DMark()).UpdateEntity<Model.MMarkType>(e);
        }

        public int DeleteMarkTypes(params string[] ids)
        {
            return (new Dal.DMark()).DeleteEntities<Model.MMarkType>(ids);
        }
        
        public Model.TotalClass<List<Model.MMark>> PagingMarks(int index, int size, string name, int typeid)
        {
            return (new Dal.DMark()).PagingMarks(index, size, name, typeid);
        }
        
        public List<Model.MMarkType> GetMarkTypeMarks()
        {
            return (new Dal.DMark()).GetMarkTypeMarks();
        }
    }
}
