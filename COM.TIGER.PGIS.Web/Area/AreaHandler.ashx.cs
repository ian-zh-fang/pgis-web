using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Area
{
    /// <summary>
    /// AreaHandler 的摘要说明
    /// </summary>
    public class AreaHandler : PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IArea))]
        private IFun.IArea _area;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            sb.Clear();
            switch (context.Request["req"])
            {
                case "1":
                    //分页获取顶级区域信息
                    PagingTopArea();
                    break;
                case "cl":
                    //分页获取指定PID的区域信息
                    PagingChildArea();
                    break;
                case "rg":
                    GetRanges();
                    //获取指定区域ID的范围信息
                    break;
                case "al":
                    //获取所有的辖区信息
                    GetArea(context);
                    break;
                case "2":
                    PagiongBelongTo();
                    break;
                case "3":
                    //获取所有的数据归属单位类型信息
                    GetBelongTos();
                    break;
                case "badd":
                    //新增归属单位类型
                    AddEntity<Model.MBelongTo>();
                    break;
                case "bup":
                    //更新归属单位类型
                    UpEntity<Model.MBelongTo>();
                    break;
                case "bdel":
                    //移除归属单位类型
                    DelEntities<Model.MBelongTo>();
                    break;
                case "add":
                    //新增区域
                    AddEntity<Model.MArea>();
                    break;
                case "up":
                    //更新区域
                    UpEntity<Model.MArea>();
                    break;
                case "del":
                    //移除区域
                    DelEntities<Model.MArea>();
                    break;
                case "radd":
                    //新增区域范围
                    AddEntity<Model.MAreaRange>();
                    break;
                case "rup":
                    //更新区域范围
                    UpEntity<Model.MAreaRange>();
                    break;
                case "rdel":
                    //移除区域范围
                    DelEntities<Model.MAreaRange>();
                    break;
                default: 
                    break;
            }
        }

        private void GetRanges()
        {
            var c = HttpContext.Current;
            var areaid = int.Parse(c.Request["id"]);
            var data = _area.GetRanges(areaid);
            Execute(c, data, true);
        }

        private void GetArea(HttpContext context)
        {
            var data = _area.GetAreasTree();
            Execute(context, data, true);
        }

        private void PagingTopArea()
        {
            var c = HttpContext.Current;
            int index = Convert.ToInt32(c.Request["start"]);
            int size = Convert.ToInt32(c.Request["limit"]);
            index = index / size + 1;
            var data = _area.PagingTopArea(index, size);
            Execute(c, data, true);
        }

        private void PagingChildArea()
        {
            var c = HttpContext.Current;
            int index = Convert.ToInt32(c.Request["start"]);
            int size = Convert.ToInt32(c.Request["limit"]);
            index = index / size + 1;
            int pid = int.Parse(c.Request["pid"]);
            var data = _area.PagingChildArea(pid, index, size);
            Execute(c, data, true);
        }

        private void PagiongBelongTo()
        { 
            var context = HttpContext.Current;
            int index = Convert.ToInt32(context.Request["start"]);
            int size = Convert.ToInt32(context.Request["limit"]);
            index = index / size + 1;
            var data = _area.PagingBelongTo(index, size);
            Execute(context, data, true);
        }

        private void GetBelongTos()
        {
            var c = HttpContext.Current;
            var data = _area.GetBelongTos();
            Execute(c, data, true);
        }

        private void AddEntity<T>() where T:new()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<T>();
            var data = _area.InsertEntity<T>(e);
            Execute(c, data);
        }

        private void UpEntity<T>() where T : new()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<T>();
            var data = _area.UpdateEntity<T>(e);
            Execute(c, data);
        }

        private void DelEntities<T>()
        {
            var c = System.Web.HttpContext.Current;
            var ids = c.Request["ids"];
            var data = _area.DeleteEntities<T>(ids);
            Execute(System.Web.HttpContext.Current, data);
        }

        private object[] All()
        {
            return _area.All();
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