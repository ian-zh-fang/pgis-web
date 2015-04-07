using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using COM.TIGER.PGIS.Model;

namespace COM.TIGER.PGIS.Dal
{
    public class DAdministrative :DBase
    {
        /// <summary>
        /// 获取所有行者区划实体
        /// </summary>
        /// <returns></returns>
        public List<Model.MAdministrative> GetEntities()
        {
            return GetEntities<Model.MAdministrative>();
        }

        public Model.TotalClass<List<Model.MAdministrative>> PageTop(int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MAdministrative>>>("PagingTop", "Administrative", 
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MAdministrative>> PageSub(int id, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MAdministrative>>>("PagingSub", "Administrative",
                string.Format("id={0}", id),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public List<Model.MAdministrative> GetAdministrativeTree()
        {
            return Post<List<Model.MAdministrative>>("GetAdministrativeTree", "Administrative").Result;
        }
    }
}
