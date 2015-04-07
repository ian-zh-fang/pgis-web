using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.Preplan
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IPreplan))]
    public partial class Plan:IFun.IPreplan
    {

        public Model.TotalClass<List<Model.MPlan>> Paging(int index, int size)
        {
            return (new Dal.DPlan()).PagingEntities<Model.MPlan>(index, size);
        }

        public List<Model.MPlan> GetPlans(params string[] ids)
        {
            return (new Dal.DPlan()).GetPlans(ids);
        }

        public List<Model.MTag> GetPlanMarks(params string[] ids)
        {
            return (new Dal.DPlan()).GetPlanMarks(ids);
        }

        public List<Model.MFile> GetPlanFiles(params string[] ids)
        {
            return (new Dal.DPlan()).GetPlanFiles(ids);
        }

        public int InsertEntity(Model.MPlan e)
        {
            return (new Dal.DPlan()).AddEntity<Model.MPlan>(e);
        }

        public int UpdateEntity(Model.MPlan e)
        {
            return (new Dal.DPlan()).UpdateEntity<Model.MPlan>(e);
        }

        public int DeleteEntities(params string[] ids)
        {
            return (new Dal.DPlan()).DeleteEntities<Model.MPlan>(ids);
        }

        public int InsertEntity(Model.MTag e, int planid)
        {
            return (new Dal.DPlan()).InsertEntity(e, planid);
        }

        public int InsertEntity(Model.MFile e, int planid)
        {
            return (new Dal.DPlan()).InsertEntity(e, planid);
        }

        public int DeletePlanMarks(int planid, params string[] ids)
        {
            return (new Dal.DPlan()).DeletePlanMarks(planid, ids);
        }

        public int DeletePlanFiles(int planid, params string[] ids)
        {
            return (new Dal.DPlan()).DeletePlanFiles(planid, ids);
        }
        
        public int InsertEntity(Model.MPlan plan, params Model.MFile[] files)
        {
            return (new Dal.DPlan()).InsertEntity(plan, files);
        }

        public int InsertEntity(Model.MFile[] files, int planid)
        {
            return (new Dal.DPlan()).InsertEntity(files, planid);
        }
        
        public int DeleteEntities(params Model.MFile[] files)
        {
            return (new Dal.DPlan()).DeleteEntities(files);
        }
    }
}
