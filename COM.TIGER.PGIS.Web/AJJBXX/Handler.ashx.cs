using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.AJJBXX
{
    /// <summary>
    /// Handler 的摘要说明
    /// </summary>
    public class Handler :PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IAJJBXX))]
        private IFun.IAJJBXX _instance = null;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            { 
                case "query":
                    Query();
                    break;
                case "qbybh":
                    QueryByBH();
                    break;
                case "tt":
                    TotalCase();
                    break;
                default:
                    break;
            }
        }

        private void QueryByBH()
        {
            string bh = HttpContext.Current.Request["bh"];

            var data = _instance.QueryByBH(bh);
            ExecuteSerialzor(data);
        }

        private void Query()
        {
            var bh = HttpContext.Current.Request["bh"];
            string xm = HttpContext.Current.Request["xm"];
            string cnb = HttpContext.Current.Request["cnb"];
            int isdrup = int.Parse(HttpContext.Current.Request["isdrup"]);
            int ispursuit = int.Parse(HttpContext.Current.Request["ispursuit"]);
            int isarrest = int.Parse(HttpContext.Current.Request["isarrest"]);

            var data = _instance.Query(bh, xm, cnb, isdrup, ispursuit, isarrest, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void TotalCase()
        {
            var data = _instance.TotalCase();
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