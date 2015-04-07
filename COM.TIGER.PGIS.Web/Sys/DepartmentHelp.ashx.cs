using COM.TIGER.PGIS.IFun;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Sys
{
    /// <summary>
    /// DepartmentHelp 的摘要说明
    /// </summary>
    public class DepartmentHelp : PageBase, IHttpHandler
    {
        [Import(typeof(ISys))]
        public ISys sys;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "1":
                    GetDepartmentsTree();
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
                    //获取所有部门信息
                    GetDepartments();
                    break;
            }
        }

        private void GetDepartmentsTree()
        {
            var v = sys.GetDepartmentsTree();
            Execute(System.Web.HttpContext.Current, v, true);
        }

        private void GetDepartments()
        {
            var data = sys.GetEntities<Model.MDepartment>();
            Execute(System.Web.HttpContext.Current, data, true);
        }

        private void DeleteEntities()
        {
            var c = System.Web.HttpContext.Current;
            var ids = c.Request["ids"];
            var v = sys.DeleteEntities<Model.MDepartment>(ids);
            Execute(c, v);
        }

        private void UpdateEntity()
        {
            var e = GetQueryParamsCollection<Model.MDepartment>();
            var v = sys.UpdateEntity<Model.MDepartment>(e);
            Execute(System.Web.HttpContext.Current, v);
        }

        private void AddEntity()
        {
            var e = GetQueryParamsCollection<Model.MDepartment>();
            var v = sys.AddEntity<Model.MDepartment>(e);
            Execute(System.Web.HttpContext.Current, v);
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