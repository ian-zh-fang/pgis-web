using COM.TIGER.PGIS.IFun;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Sys
{
    /// <summary>
    /// RoleHelp 的摘要说明
    /// </summary>
    public class RoleHelp :PageBase, IHttpHandler
    {
        [Import(typeof(ISys))]
        public ISys sys;
        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "1":
                    PagingEntities();
                    break;
                case "2":
                    //获取指定角色的菜单
                    GetRoleMenus();
                    break;
                case "3":
                    //保存新的菜单信息
                    SaveRoleMenus();
                    break;
                case "add":
                    //添加
                    AddEntity();
                    break;
                case "up":
                    //修改
                    UpdateEntity();
                    break;
                case "del":
                    DeleteEntities();
                    //删除
                    break;
                default:
                    GetRoleTree();
                    break;
            }
        }

        private void GetRoleTree()
        {
            var data = Model.MRole.Cast<Model.MRoleEx>(sys.GetEntities<Model.MRole>());
            Execute(System.Web.HttpContext.Current, data, true);
        }

        private void GetEntities()
        {
            var data = sys.GetEntities<Model.MRole>();
            Execute(System.Web.HttpContext.Current, data);
        }

        private void PagingEntities()
        {
            int start = Convert.ToInt32(System.Web.HttpContext.Current.Request["start"]);
            int limit = Convert.ToInt32(System.Web.HttpContext.Current.Request["limit"]);
            int index = start / limit + 1;
            int size = limit;
            var data = sys.PagingEntities<Model.MRole>(index, size);
            Execute(System.Web.HttpContext.Current, data, true);
        }

        private void GetRoleMenus()
        {
            var c = System.Web.HttpContext.Current;
            var id = int.Parse(c.Request["id"]);
            var data = sys.GetRoleMenus(id);
            Execute(c, data);
        }

        private void SaveRoleMenus()
        {
            var c = System.Web.HttpContext.Current;
            var id = int.Parse(c.Request["id"]);
            var ids = c.Request["ids"];
            var data = sys.SaveRoleMenus(id, ids.Split(','));
            Execute(c, data);
        }

        private void DeleteEntities()
        {
            var c = System.Web.HttpContext.Current;
            var ids = c.Request["ids"];
            var v = sys.DeleteEntities<Model.MRole>(ids);
            Execute(System.Web.HttpContext.Current, v);
        }

        private void UpdateEntity()
        {
            var e = GetQueryParamsCollection<Model.MRole>();
            var v = sys.UpdateEntity<Model.MRole>(e);
            Execute(System.Web.HttpContext.Current, v);
        }

        private void AddEntity()
        {
            var e = GetQueryParamsCollection<Model.MRole>();
            var v = sys.AddEntity<Model.MRole>(e);
            Execute(System.Web.HttpContext.Current, v);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}