using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using COM.TIGER.PGIS.Model;

namespace COM.TIGER.PGIS.Dal
{
    public class DStreet : DBase
    {
        /// <summary>
        /// 根据行政区划id获取街道实体
        /// </summary>
        /// <returns></returns>
        public List<Model.MStreet> GetStreetEntitiesByaid(int aid)
        {
            var attr = GetRemoteControllerAttribute<Model.MStreet>();
            var action = "GetEntities";
            return Post<List<Model.MStreet>>(action, attr.ControllerName, string.Format("adminid={0}", aid)).Result;
        }
    }
}
