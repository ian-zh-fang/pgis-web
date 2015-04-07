using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DMark:DBase
    {
        public List<Model.MMark> GetMarks(params string[] ids)
        {
            if (ids.Length == 0)
                return GetEntities<Model.MMark>();

            return Post<List<Model.MMark>>("GetMarks", "Mark", string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public List<Model.MMarkEx> GetMarksTree()
        {
            return Post<List<Model.MMarkEx>>("GetTags", "Tag").Result;
        }

        public List<Model.MMarkType> GetMarkTypes(params string[] ids)
        {
            if (ids.Length == 0)
                return GetEntities<Model.MMarkType>();

            return Post<List<Model.MMarkType>>("GetMarkTypes", "MarkType", string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public Model.TotalClass<List<Model.MMark>> PagingMarks(int index, int size, string name, int typeid)
        {
            return Post<Model.TotalClass<List<Model.MMark>>>("PagingMarks", "Mark",
                string.Format("index={0}", index),
                string.Format("size={0}", size),
                string.Format("name={0}", name),
                string.Format("typeid={0}", typeid)).Result;
        }

        public List<Model.MMarkType> GetMarkTypeMarks()
        {
            return Post<List<Model.MMarkType>>("GetMarkTypeMarks", "MarkType").Result;
        }
    }
}
