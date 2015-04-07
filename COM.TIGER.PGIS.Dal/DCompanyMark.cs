using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using COM.TIGER.PGIS.Model;

namespace COM.TIGER.PGIS.Dal
{
    public class DCompanyMark : DBase {
        /// <summary>
        /// 分页获取数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="index">当前页码</param>
        /// <param name="size">每页显示条目数</param>
        /// <param name="type">查询类型</param>
        /// <returns></returns>
        public TotalClass<List<T>> PagingEntities<T>(int index, int size, int type)
        {
            var attr = GetRemoteControllerAttribute<T>();
            var action = string.Format("Paging{0}", attr.ModelName);
            return Post<TotalClass<List<T>>>(action, attr.ControllerName,
                string.Format("index={0}", index), string.Format("size={0}", size),string.Format("type={0}", type)).Result;
        }
    }
}
