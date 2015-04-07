using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using COM.TIGER.PGIS.Model;

namespace COM.TIGER.PGIS.Dal
{
    public class DStreetNum : DBase
    {
        /// <summary>
        /// 根据街道id获取门牌实体
        /// </summary>
        /// <returns></returns>
        public List<Model.MStreetNum> GetStreetNumEntitiesByaid(int sid)
        {
            var attr = GetRemoteControllerAttribute<Model.MStreetNum>();
            var action = "GetEntities";
            return Post<List<Model.MStreetNum>>(action, attr.ControllerName, string.Format("streetid={0}", sid)).Result;
        }
    }
}
