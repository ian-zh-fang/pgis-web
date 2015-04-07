using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Officer
{
    /// <summary>
    /// OfficerHelp 的摘要说明
    /// </summary>
    public class OfficerHelp :PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IOfficer))]
        IFun.IOfficer _instance;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            { 
                case "1":
                    PageEntities();
                    break;
                case "add":
                    AddEntity();
                    break;
                case "up":
                    UpdateEntity();
                    break;
                case "del":
                    DeleteEntities();
                    break;
                case "all":
                    GetEntities();
                    break;
                default:
                    break;
            }
        }

        private void GetEntities()
        {
            var data = _instance.GetEntities();
            Execute(HttpContext.Current, data, true);
        }

        private void AddEntity()
        {
            var e = GetQueryParamsCollection<Model.MOfficer>();
            var data = _instance.InsertEntity(e);
            Execute(HttpContext.Current, data);
        }

        private void UpdateEntity()
        {
            var e = GetQueryParamsCollection<Model.MOfficer>();
            var data = _instance.UpdateEntity(e);
            Execute(HttpContext.Current, data);
        }

        private void DeleteEntities()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteEntities(ids);
            Execute(HttpContext.Current, data);
        }

        private void PageEntities()
        {
            var data = _instance.Page(CurrentPage, PagerSize);
            Execute(HttpContext.Current, data, true);
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