using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.PatrolArea
{
    /// <summary>
    /// PatrolAreaHandler 的摘要说明
    /// </summary>
    public class PatrolAreaHandler :PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IPatrolArea))]
        private IFun.IPatrolArea _PatrolArea;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "al":
                    //获取所有的巡防区域信息
                    GetPatrolAreaTree(context);
                    break;
                case "1":
                    GetPatrolArea(context);
                    break;
                case "3"://删除记录
                    DelEntities<COM.TIGER.PGIS.Model.MPatrolArea>();
                    break;
                case "add"://添加记录
                    AddEntity<Model.MPatrolArea>();
                    break;
                case "up"://更新记录
                    UpEntity<Model.MPatrolArea>();
                    break;
            }
        }

        private void UpEntity<T>() where T : new()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<T>();
            var data = _PatrolArea.UpdateEntity<T>(e);
            Execute(c, data);
        }

        private void AddEntity<T>() where T : new()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<T>();
            var data = _PatrolArea.InsertEntity<T>(e);
            Execute(c, data);
        }

        private void DelEntities<T>()
        {
            var c = System.Web.HttpContext.Current;
            var ids = c.Request["ids"];
            var data = _PatrolArea.DeleteEntities<T>(ids);
            Execute(c, data);
        }
        private void GetPatrolArea(HttpContext context) 
        {
            var c = HttpContext.Current;
            int index = Convert.ToInt32(c.Request["start"]);
            int size = Convert.ToInt32(c.Request["limit"]);
            index = index / size + 1;
            var data = _PatrolArea.Page(index, size);
            Execute(context, data, true);
        }
        /// <summary>
        /// 获取所有的巡防区域信息
        /// </summary>
        /// <param name="context"></param>
        private void GetPatrolAreaTree(HttpContext context)
        {
            List<Model.MPatrolArea> data = _PatrolArea.GetPatrolArea();
            Execute(context, data, true);
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