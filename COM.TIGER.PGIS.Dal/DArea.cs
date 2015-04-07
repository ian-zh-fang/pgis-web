using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DArea:DBase
    {
        public List<Model.MBelongTo> GetBelongTos(params string[] ids)
        {
            var v = string.Join(",", ids);
            return Post<List<Model.MBelongTo>>("GetBelongTos", "BelongTo", string.Format("ids={0}", v)).Result;
        }

        public Model.TotalClass<List<Model.MBelongTo>> PagingBelongTo(int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MBelongTo>>>("PagingBelongTos", "BelongTo", 
                "index=" + index, "size=" + size).Result; 
        }
        
        public Model.TotalClass<List<Model.MArea>> PagingTopArea(int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MArea>>>("PagingTopAreas", "Area", 
                string.Format("index={0}", index), string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MArea>> PagingChildArea(int pid, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MArea>>>("PagingAreas", "Area",
                string.Format("pid={0}", pid), 
                string.Format("index={0}", index), 
                string.Format("size={0}", size)).Result;
        }

        public List<Model.MAreaRange> GetRanges(int areaid)
        {
            return Post<List<Model.MAreaRange>>("GetRanges", "Range", string.Format("id={0}", areaid)).Result;
        }

        public List<Model.MArea> GetAreasTree()
        {
            return Post<List<Model.MArea>>("GetAreasTree", "Area").Result;
        }
    }
}
