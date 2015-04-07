using COM.TIGER.PGIS.IFun;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.ToolHelp
{
    /// <summary>
    /// ToolHandler 的摘要说明
    /// </summary>
    public class ToolHandler :PageBase, IHttpHandler
    {

        [Import(typeof(ICompanyMark))]
        public ICompanyMark _companymark;
        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "0":
                    Paging(0);
                    break;
                case "1":
                    Paging(1);
                    break;
                case "add":
                    InsertEntity();
                    break;
                case "del":
                    DeleteEntities();
                    break;
                default: break;
            }
        }

        private void InsertEntity()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<Model.MCompanyMark>();
            var data = _companymark.InsertEntity(e);
            Execute(c, data);
        }

        private void Paging(int type)
        {
            var c = HttpContext.Current;
            int index = Convert.ToInt32(c.Request["start"]);
            int size = Convert.ToInt32(c.Request["limit"]);
            index = index / size + 1;
            var data = _companymark.PagingCompanyMarks(index, size, type);
            Execute(c, data, true);
        }

        private void DeleteEntities()
        {
            var c = HttpContext.Current;
            var ids = c.Request["ids"];
            var data = _companymark.DeleteEntities(ids);
            Execute(c, data);
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