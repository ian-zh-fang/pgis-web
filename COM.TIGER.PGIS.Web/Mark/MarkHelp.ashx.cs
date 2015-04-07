using COM.TIGER.PGIS.IFun;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Mark
{
    /// <summary>
    /// MarkHelp 的摘要说明
    /// </summary>
    public class MarkHelp :PageBase, IHttpHandler
    {
        [Import(typeof(IMark))]
        IMark _mark;
        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "1":
                    Paging();
                    break;
                case "2":
                    //获取所有的标注信息
                    GetMarks();
                    break;
                case "3":
                    //获取所有的标注类型信息
                    GetMarkTypes();
                    break;
                case "s":
                    //根据标注名称和标注类型查询数据
                    GetMarksByNameAndType();
                    break;
                case "tree":
                    //返回一个 Model.MarkType 类型的对象列表，每一个对象都包含对应的标注信息
                    GetMarkTypeMarks();
                    break;
                case "add":
                    InsertEntity();
                    break;
                case "up":
                    UpdateEntity();
                    break;
                case "del":
                    DeleteEntities();
                    break;
                case "al":
                    GetMarkRange(context);
                    break;
                case "tadd":
                    InsertMarkType();
                    break;
                case "tup":
                    UpdateMarkType();
                    break;
                case "tdel":
                    DeleteMarkTypes();
                    break;
                default: break;
            }
        }

        private void GetMarkTypeMarks()
        {
            var data = _mark.GetMarkTypeMarks();
            Execute(HttpContext.Current, data, true);
        }

        private void GetMarksByNameAndType()
        {
            var c = HttpContext.Current;
            var tid = c.Request["TypeID"] == null ? -1 : int.Parse(c.Request["TypeID"]);
            var name = c.Request["Name"] ?? string.Empty;

            int index = Convert.ToInt32(c.Request["start"]);
            int size = Convert.ToInt32(c.Request["limit"]);
            index = index / size + 1;

            var data = _mark.PagingMarks(index, size, name, tid);
            Execute(c, data, true);
        }

        private void InsertMarkType()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<Model.MMarkType>();
            var file = SaveFile(c.Request.Files);
            if (file != null && !string.IsNullOrWhiteSpace(file.Name))
                e.IconCls = string.Format("{0}.{1}", file.Alias, file.Suffix);
            var data = _mark.InsertMarkType(e);
            Execute(c, data);
        }

        private FileInfoExtention SaveFile(HttpFileCollection files)
        {
            if (files.Count == 0)
                return null;

            var file = SaveFileAt(files[0], "\\Resources\\images\\mark\\");
            return file;
        }

        private void UpdateMarkType()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<Model.MMarkType>();
            var file = SaveFile(c.Request.Files);
            if (file != null && !string.IsNullOrWhiteSpace(file.Name))
                e.IconCls = string.Format("{0}.{1}", file.Alias, file.Suffix);
            var data = _mark.UpdateMarkType(e);
            Execute(HttpContext.Current, data);
        }

        private void DeleteMarkTypes()
        {
            var c = HttpContext.Current;
            var ids = c.Request["ids"];
            var data = _mark.DeleteMarkTypes(ids);
            Execute(c, data);
        }

        private void GetMarkTypes()
        {
            var data = _mark.GetMarkTypes();
            Execute(HttpContext.Current, data, true);
        }

        private void GetMarks()
        {
            var data = _mark.GetMarksTree();
            Execute(HttpContext.Current, data, true);
        }

        private void GetMarkRange(HttpContext context)
        {
            var data = _mark.GetMarks();
            var tree = new
            {
                text = "桐梓县",
                children = (from t in data select new { text = t.Name, leaf = true, expend = true, coords=t.Coordinates, color=t.Color, X=t.X, Y=t.Y, ID=t.ID }).ToArray()
            };
            Execute(context, tree, true);
        }

        private void DeleteEntities()
        {
            var c = HttpContext.Current;
            var ids = c.Request["ids"];
            var data = _mark.DeleteEntities(ids);
            Execute(c, data);
        }

        private void UpdateEntity()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<Model.MMark>();
            var file = SaveFile(c.Request.Files);
            if (file != null && !string.IsNullOrWhiteSpace(file.Name))
                e.IconCls = string.Format("{0}.{1}", file.Alias, file.Suffix);
            var data = _mark.UpdateEntity(e);
            Execute(c, data);
        }

        private void InsertEntity()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<Model.MMark>();
            var file = SaveFile(c.Request.Files);
            if (file != null && !string.IsNullOrWhiteSpace(file.Name))
                e.IconCls = string.Format("{0}.{1}", file.Alias, file.Suffix);
            var data = _mark.InsertEntity(e);
            Execute(c, data);
        }

        private void Paging()
        {
            var c = HttpContext.Current;
            int index = Convert.ToInt32(c.Request["start"]);
            int size = Convert.ToInt32(c.Request["limit"]);
            index = index / size + 1;
            var data = _mark.PagingMarks(index, size);
            Execute(c, data, true);
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