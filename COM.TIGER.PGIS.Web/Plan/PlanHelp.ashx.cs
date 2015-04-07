using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Plan
{
    /// <summary>
    /// PlanHelp 的摘要说明
    /// </summary>
    public class PlanHelp : PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IPreplan))]
        private IFun.IPreplan _plan;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context); 
            switch (context.Request["req"])
            {
                case "1":
                    //分页获取预案信息
                    PagingPlan();
                    break;
                case "pg_al":
                    //分页获取预案信息
                    PagingPlan();
                    break;
                case "tg":
                    //获取指定预案的标注信息
                    GetPlanTags();
                    break;
                case "fl":
                    //获取指定预案的文档信息
                    GetPlanFiles();
                    break;
                case "tadd":
                    //添加新的标注信息
                    AddMark();
                    break;
                case "tdel":
                    DelMark();
                    break;
                case "fadd":
                    //上传新的文档信息
                    AddFile();
                    break;
                case "fdel":
                    DelFile();
                    break;
                case "add":
                    //新增区域
                    AddEntity();
                    break;
                case "up":
                    //更新区域
                    UpEntity();
                    break;
                case "del":
                    //移除区域
                    DelEntities();
                    break;
                case "tag":
                    TagsManager();
                    break;
                case "doc":
                    DocumentManager();
                    break;
                default:
                    break;
            }
        }

        /// <summary>
        /// 文件处理程序
        /// </summary>
        private void DocumentManager()
        {
            switch (HttpContext.Current.Request["dreq"])
            {
                case "add":
                    AddFiles();
                    break;
                case "upfile":
                    //上传文件
                    SaveUploadFile();
                    break;
                case "down":
                    DownLoadFile();
                    break;
                case "fl":
                    GetPlanFiles();
                    break;
                case "del":
                    DeleteFiles();
                    break;
                default: 
                    break;
            }
        }

        private void DownLoadFile()
        {
            var e = GetQueryParamsCollection<Model.MFile>();
            DownLoadFile(e);
        }

        /// <summary>
        /// 标注处理程序
        /// </summary>
        private void TagsManager()
        {
            switch (HttpContext.Current.Request["treq"])
            {
                case "add":
                    AddMark();
                    break;
                case "all":
                    //获取所有的标注信息
                    GetPlanTags();
                    break;
                default:
                    break;
            }
        }

        private void DelFile()
        {
            var c = HttpContext.Current;
            //预案ID
            var id = int.Parse(c.Request["planid"]);
            var ids = c.Request["ids"];
            var data = _plan.DeletePlanFiles(id, ids);
            Execute(c, data);
        }

        private void DelMark()
        {
            var c = HttpContext.Current;
            //预案ID
            var id = int.Parse(c.Request["planid"]);
            var ids = c.Request["ids"];
            var data = _plan.DeletePlanMarks(id, ids);
            Execute(c, data);
        }

        private void AddMark()
        {
            var c = HttpContext.Current;
            //预案ID
            var id = int.Parse(c.Request["id"]);
            var e = GetQueryParamsCollection<Model.MTag>();
            var data = _plan.InsertEntity(e, id);
            Execute(c, data);
        }

        private void AddFile()
        {
            var c = HttpContext.Current;
            //保存上传文件

            //保存文件记录
            //预案ID
            var id = int.Parse(c.Request["planid"]);
            var e = GetQueryParamsCollection<Model.MFile>();
            var data = _plan.InsertEntity(e, id);
            Execute(c, data);
        }

        private void AddFiles()
        {
            var c = HttpContext.Current;
            var id = int.Parse(c.Request["id"]);
            var files = Newtonsoft.Json.JsonConvert.DeserializeObject<FileInfoExtention[]>(c.Request["upfiles"]);
            var docs = (from t in files select new Model.MFile() { Alias = t.Name, Name = t.Alias, Path = "Uploads\\PrePlan\\", Suffix = t.Suffix }).ToArray();
            var data = _plan.InsertEntity(docs, id);
            Execute(c, data);
        }

        private void DeleteFiles()
        {
            var c = HttpContext.Current;
            var files = Newtonsoft.Json.JsonConvert.DeserializeObject<Model.MFile[]>(c.Request["upfiles"]);
            var data = _plan.DeleteEntities(files);
            RemoveDocument(files);
            Execute(c, data);
        }

        private void GetPlanFiles()
        {
            var c = HttpContext.Current;
            //预案ID
            var id = c.Request["id"];
            var data = _plan.GetPlanFiles(id);
            Execute(c, data, true);
        }

        private void GetPlanTags()
        {
            var c = HttpContext.Current;
            //预案ID
            var id = c.Request["id"];
            var data = _plan.GetPlanMarks(id);
            Execute(c, data, true);
        }

        private void DelEntities()
        {
            var c = HttpContext.Current;
            var ids = c.Request["ids"];
            Execute(c, _plan.DeleteEntities(ids));
        }

        private void UpEntity()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<Model.MPlan>();
            Execute(c, _plan.UpdateEntity(e));
        }

        private void AddEntity()
        {
            var c = HttpContext.Current;
            var e = GetQueryParamsCollection<Model.MPlan>();
            var filestr = c.Request["upfiles"];
            if (!string.IsNullOrEmpty(filestr))
            {
                //保存文件
                var files = Newtonsoft.Json.JsonConvert.DeserializeObject<FileInfoExtention[]>(filestr);
                var docs = (from t in files select new Model.MFile() { Alias = t.Name, Name = t.Alias, Path = "Uploads\\PrePlan\\", Suffix = t.Suffix }).ToArray();
                Execute(c, _plan.InsertEntity(e, docs));
            }
            else
            {
                Execute(c, _plan.InsertEntity(e));
            }
        }

        /// <summary>
        /// 保存上传文件
        /// </summary>
        private void SaveUploadFile()
        {
            var c = HttpContext.Current;
            var req = c.Request;
            var directpath = "PrePlan";
            var result = new List<FileInfoExtention>();
            for (var i = 0; i < req.Files.Count; i++)
            {
                var file = req.Files[i];
                if (file.ContentLength == 0) continue;
                var obj = SaveFile(file, directpath);
                //保存文件数据到数据库
                result.Add(obj);
            }
            Execute(c, result);
        }

        private void PagingPlan()
        {
            var c = HttpContext.Current;
            int index = Convert.ToInt32(c.Request["start"]);
            int size = Convert.ToInt32(c.Request["limit"]);
            index = index / size + 1;
            var data = _plan.Paging(index, size);
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