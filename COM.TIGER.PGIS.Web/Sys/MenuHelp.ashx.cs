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
    /// MenuHelp 的摘要说明
    /// </summary>
    public class MenuHelp : PageBase, IHttpHandler
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
                    //预留，登陆用户获取相应权限
                    InitMenu();
                    break;
                case "2":
                    //获取分页数据
                    PageMenu();
                    break;
                case "3":
                    //获取子菜单
                    GetSubMenus();
                    break;
                case "4":
                    //获取树状菜单信息
                    GetMenusTree();
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
                default: break;
            }
        }

        private void InitMenu()
        {
            var id = HttpContext.Current.Request["id"];
            sb.Append(sys.InitMenu(id));
            Execute(System.Web.HttpContext.Current, sb.ToString());
        }

        /// <summary>
        /// 获取顶级菜单分页数据
        /// </summary>
        private void PageMenu()
        {
            int start = Convert.ToInt32(System.Web.HttpContext.Current.Request["start"]);
            int limit = Convert.ToInt32(System.Web.HttpContext.Current.Request["limit"]);
            int index = start / limit + 1;
            int size = limit;
            var data = sys.PageTopMenus(index, size);
            Execute(System.Web.HttpContext.Current, data, true);
        }

        private void GetMenusTree()
        {
            var data = sys.GetMenusTree();
            Execute(System.Web.HttpContext.Current, data, true);
        }

        private void GetSubMenus()
        {
            var c = System.Web.HttpContext.Current;
            var id = int.Parse(c.Request["id"]);
            var data = sys.GetSubMenu(id, false);
            Execute(c, data, true);
        }

        /// <summary>
        /// 添加实体类型
        /// </summary>
        private void AddEntity()
        {
            var e = GetQueryParamsCollection<Model.MMenu>();
            var v = sys.AddMenu(e);
            Execute(System.Web.HttpContext.Current, v);
        }

        /// <summary>
        /// 更新实体类型
        /// </summary>
        private void UpdateEntity()
        {
            var e = GetQueryParamsCollection<Model.MMenu>();
            var v = sys.UpdateMenu(e);
            Execute(System.Web.HttpContext.Current, v);
        }

        /// <summary>
        /// 批量移除指定菜单信息
        /// </summary>
        private void DeleteEntities()
        {
            var c = System.Web.HttpContext.Current;
            var ids = c.Request["ids"];
            var v = sys.DeleteMenus(ids);
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