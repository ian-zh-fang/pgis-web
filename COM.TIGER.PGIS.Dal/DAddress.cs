using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DAddress:DBase
    {
        /// <summary>
        /// 模糊匹配地址，并取当前的前10项
        /// </summary>
        /// <param name="pattern">详细地址</param>
        /// <returns></returns>
        public List<Model.MAddress> Match(string pattern)
        {
            var attr = GetRemoteControllerAttribute<Model.MAddress>();
            var action = "Match";
            return Post<List<Model.MAddress>>(action, attr.ControllerName, string.Format("pattern={0}", pattern)).Result;
        }
    }
}
