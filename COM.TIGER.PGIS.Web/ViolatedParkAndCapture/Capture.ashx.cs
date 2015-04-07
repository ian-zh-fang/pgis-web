using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.ViolatedParkAndCapture
{
    /// <summary>
    /// 违停抓拍处理程序
    /// </summary>
    public class Capture : PageBase, IHttpHandler
    {
        private const string CONFIGNAME = "Capture.xml";
        /// <summary>
        /// 获取配置文件物理路径
        /// </summary>
        private string Configfilename
        {
            get { return string.Format("{0}{1}{2}", MapPth, CONFIGPATH, CONFIGNAME); }
        }

        [System.ComponentModel.Composition.Import(typeof(IFun.IViolatedParkAndCapture))]
        private IFun.IViolatedParkAndCapture _capture;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "1":
                    Paging();
                    break;
                case "2":
                    GetTypes();
                    break;
                case "tree":
                    GetCaptureForTree();
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
                case "tadd":
                    InsertEntityType();
                    break;
                case "tup":
                    UpdateEntityType();
                    break;
                case "tdel":
                    DeleteEntityTypes();
                    break;
                default: break;
            }
        }

        private void GetCaptureForTree()
        {
            var data = _capture.GetCaptureForTree(Configfilename);
            Execute(HttpContext.Current, data, true);
        }

        private void GetTypes()
        {
            var data = _capture.GetTypes(Configfilename);
            Execute(HttpContext.Current, data, true);
        }

        private void DeleteEntityTypes()
        {
            var c = HttpContext.Current;
            var ids = c.Request["ids"].Split(',');
            var data = _capture.DeleteTypes(Configfilename, ids);
            Execute(c, data);
        }

        private void UpdateEntityType()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<Model.CaptureType>();
            var file = SaveFile(c.Request.Files);
            if (file != null && !string.IsNullOrWhiteSpace(file.Name))
                e.IconCls = string.Format("{0}.{1}", file.Alias, file.Suffix);
            var data = _capture.UpdateType(Configfilename, e);
            Execute(c, data);
        }

        private void InsertEntityType()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<Model.CaptureType>();
            var file = SaveFile(c.Request.Files);
            if (file != null && !string.IsNullOrWhiteSpace(file.Name))
                e.IconCls = string.Format("{0}.{1}", file.Alias, file.Suffix);
            var data = _capture.InsertType(Configfilename, e);
            Execute(c, data);
        }

        private FileInfoExtention SaveFile(HttpFileCollection files)
        {
            if (files.Count == 0)
                return null;

            var file = SaveFileAt(files[0], "\\Resources\\images\\mark\\");
            return file;
        }

        private void DeleteEntities()
        {
            var c = HttpContext.Current;
            var ids = c.Request["ids"];
            var data = _capture.DeleteEntities(ids);
            Execute(c, data);
        }

        private void UpdateEntity()
        {
            var e = GetQueryParamsCollection<Model.Capture>();
            var data = _capture.UpdateEntity(e);
            Execute(HttpContext.Current, data);
        }

        private void InsertEntity()
        {
            var e = GetQueryParamsCollection<Model.Capture>();
            var data = _capture.InsertEntity(e);
            Execute(HttpContext.Current, data);
        }

        private void Paging()
        {
            var c = HttpContext.Current;
            int index = Convert.ToInt32(c.Request["start"]);
            int size = Convert.ToInt32(c.Request["limit"]);
            index = index / size + 1;
            var data = _capture.Pagging(Configfilename, index, size);
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