using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.XAddress
{
    /// <summary>
    /// AddressHelper 的摘要说明
    /// </summary>
    public class AddressHelper : PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IAddr))]
        private IFun.IAddr _instance = null;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "mat":
                    MatchAddr();
                    break;
                default:
                    break;
            }
        }

        private void MatchAddr()
        {
            var addr = HttpContext.Current.Request["query"];
            var data = _instance.Match(addr);
            ExecuteSerialzor(data);
        }

        public new bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}