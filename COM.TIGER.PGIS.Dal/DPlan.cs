using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    /// <summary>
    /// 
    /// </summary>
    public class DPlan:DBase
    {
        /// <summary>
        /// 获取指定ID的预案数据
        /// <para>如果没有指定ID，那么获取所有的预案信息</para>
        /// </summary>
        /// <param name="ids">需要指定的ID</param>
        /// <returns></returns>
        public List<Model.MPlan> GetPlans(params string[] ids)
        {
            if (ids.Length == 0)
                return GetEntities<Model.MPlan>();

            return Post<List<Model.MPlan>>("GetPlans", "Plan", string.Format("ids={0}", string.Join(",", ids))).Result;
        }
        
        /// <summary>
        /// 获取指定ID的标注信息
        /// </summary>
        /// <param name="ids">指定预案ID</param>
        /// <returns></returns>
        public List<Model.MTag> GetPlanMarks(params string[] ids)
        {
            var idstr = string.Join(",", ids);
            return Post<List<Model.MTag>>("GetPlanTags", "Plan", string.Format("ids={0}", idstr)).Result;
        }

        /// <summary>
        /// 获取指定ID的文档信息
        /// </summary>
        /// <param name="ids">指定预案ID</param>
        /// <returns></returns>
        public List<Model.MFile> GetPlanFiles(params string[] ids)
        {
            var idstr = string.Join(",", ids);
            return Post<List<Model.MFile>>("GetPlanFiles", "Plan", string.Format("ids={0}", idstr)).Result;
        }

        public int InsertEntity(Model.MTag e, int planid)
        {
            var v = Newtonsoft.Json.JsonConvert.SerializeObject(e);
            return Post<int>("InsertPlanTagForJson", "Plan", string.Format("v={0}", v), string.Format("planid={0}", planid)).Result;
        }

        public int InsertEntity(Model.MFile e, int planid)
        {
            var v = Newtonsoft.Json.JsonConvert.SerializeObject(e);
            return Post<int>("InsertPlanFileForJson", "Plan", string.Format("v={0}", v), string.Format("planid={0}", planid)).Result;
        }

        public int InsertEntity(Model.MPlan plan, params Model.MFile[] files)
        {
            var v = Newtonsoft.Json.JsonConvert.SerializeObject(files);
            var p = Newtonsoft.Json.JsonConvert.SerializeObject(plan);
            return Post<int>("InsertPlanFilesForJson", "Plan", string.Format("v={0}", v), string.Format("p={0}", p)).Result;
        }

        public int InsertEntity(Model.MFile[] files, int planid)
        {
            var v = Newtonsoft.Json.JsonConvert.SerializeObject(files);
            return Post<int>("InsertPlanFilesForJson", "Plan", string.Format("v={0}", v), string.Format("planid={0}", planid)).Result;
        }

        public int DeleteEntities(params Model.MFile[] files)
        {
            if (files.Length == 0) return 0;
            var v = Newtonsoft.Json.JsonConvert.SerializeObject(files);
            return Post<int>("DeleteFiles", "Plan", string.Format("v={0}", v)).Result;
        }
        
        public int DeletePlanMarks(int planid, params string[] ids)
        {
            return DeletePlanItems("DeletePlanTags", planid, ids);
        }

        public int DeletePlanFiles(int planid, params string[] ids)
        {
            return DeletePlanItems("DeletePlanFiles", planid, ids);
        }

        /// <summary>
        /// 移除指定预案的关联信息
        /// </summary>
        /// <param name="action">远程API执行方法</param>
        /// <param name="planid">指定预案ID</param>
        /// <param name="ids">与预案数据有关联的数据记录ID</param>
        /// <returns></returns>
        private int DeletePlanItems(string action, int planid, params string[] ids)
        {
            return Post<int>(action, "Plan", string.Format("planid={0}", planid), string.Format("ids={0}", string.Join(",", ids))).Result;
        }
    }
}
