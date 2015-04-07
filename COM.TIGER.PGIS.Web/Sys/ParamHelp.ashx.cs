using COM.TIGER.PGIS.IFun;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.Linq;
using System.Text;
using System.Web;

namespace COM.TIGER.PGIS.Web.Sys
{
    /// <summary>
    /// ParamHelp 的摘要说明
    /// </summary>
    public class ParamHelp : PageBase, IHttpHandler
    {
        [Import(typeof(ISys))]
        public ISys sys;
        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            sb.Clear();
            switch (context.Request["req"])
            {
                case "1":
                    GetParamForPage(context);
                    //GetParam(context);
                    break;
                case "2":
                    GetParamByID(context);
                    break;
                case "3":
                    DeleteParam(context);
                    break;
                case "add":
                    AddParam(context);
                    break;
                case "up":
                    UpdateParam(context);
                    break;
                case "bcode":
                    GetParamsByCode();
                    break;
                default:
                    break;
            }           
        }

        private void GetParamsByCode()
        {
            var code = HttpContext.Current.Request["code"];
            var data = sys.GetParamsByCode(code);
            ExecuteSerialzor(data);
        }

        private void UpdateParam(HttpContext context)
        {
            int id = Convert.ToInt32(context.Request["ID"]);
            int pid = Convert.ToInt32(context.Request["PID"]);
            string name = context.Request["Name"].ToString();
            string code = context.Request["Code"].ToString();
            string disabled = context.Request["Disabled"].ToString();
            string sort = context.Request["Sort"].ToString();
            Execute(context, sys.UpdateParam(name, code, disabled, sort, id,pid));  
        }

        private void AddParam(HttpContext context)
        {
            string name = context.Request["Name"].ToString();
            string code = context.Request["Code"].ToString();
            string disabled = context.Request["Disabled"].ToString();
            string sort = context.Request["Sort"].ToString();
            int pid = Convert.ToInt32(context.Request["PID"]);;
            Execute(context, sys.AddParam(name, code, disabled, sort, pid));  
        }

        private void DeleteParam(HttpContext context)
        {
            string ids = context.Request["ids"].ToString();
            Execute(context, sys.DeleteParam(ids));  
        }
        private void GetParamForPage(HttpContext context) {
            int start = Convert.ToInt32(context.Request["start"]);
            int limit = Convert.ToInt32(context.Request["limit"]);
            Execute(context, sys.GetParamForPage(start / limit + 1, limit), true);
        }
        private void GetParamByID(HttpContext context)
        {
            int id = Convert.ToInt32(context.Request["id"]);
            Execute(context, sys.GetParamByID(id));  
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