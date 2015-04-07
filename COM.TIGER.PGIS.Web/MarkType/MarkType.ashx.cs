using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.MarkType
{
    /// <summary>
    /// MarkType 的摘要说明
    /// </summary>
    public class MarkType : PageBase, IHttpHandler
    {

        public new void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write("Hello World");
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