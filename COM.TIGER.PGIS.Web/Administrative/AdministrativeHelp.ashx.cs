using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Administrative
{
    /// <summary>
    /// AdministrativeHelp 的摘要说明
    /// </summary>
    public class AdministrativeHelp :PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IAdministrative))]
        private IFun.IAdministrative _instance;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            { 
                case "1":
                    pageTop();
                    break;
                case "2":
                    PageSub();
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
                case "tree":
                    GetAdministrativeTree();
                    break;
                default:
                    break;
            }
        }

        private void GetAdministrativeTree()
        {
            var data = _instance.GetAdministrativeTree();
            Execute(HttpContext.Current, data, true);
        }

        private void pageTop()
        {
            var data = _instance.PageTop(CurrentPage, PagerSize);
            Execute(HttpContext.Current, data, true);
        }

        private void PageSub()
        {
            var id = Convert.ToInt32(HttpContext.Current.Request["id"]);
            var data = _instance.PageSub(id, CurrentPage, PagerSize);
            Execute(HttpContext.Current, data, true);
        }

        private void Pagging()
        {
            var data = _instance.Pagging(CurrentPage, PagerSize);
            Execute(HttpContext.Current, data, true);
        }

        private void AddEntity()
        {
            var e = GetQueryParamsCollection<Model.MAdministrative>();
            var data = _instance.AddEntity(e);
            Execute(HttpContext.Current, data);
        }

        private void UpdateEntity()
        {
            var e = GetQueryParamsCollection<Model.MAdministrative>();
            var data = _instance.UpdateEntity(e);
            Execute(HttpContext.Current, data);
        }

        private void DeleteEntities()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteEntities(ids);
            Execute(HttpContext.Current, data);
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