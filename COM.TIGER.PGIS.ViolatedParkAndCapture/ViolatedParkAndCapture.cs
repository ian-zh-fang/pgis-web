using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace COM.TIGER.PGIS.AddIn.ViolatedParkAndCapture
{
    /// <summary>
    /// 违停抓拍处理
    /// </summary>
    [System.ComponentModel.Composition.Export(typeof(IFun.IViolatedParkAndCapture))]
    public class ViolatedParkAndCapture:IFun.IViolatedParkAndCapture
    {
        public COM.TIGER.PGIS.Model.TotalClass<List<COM.TIGER.PGIS.Model.Capture>> Pagging(string filename, int index, int size)
        {
            return (new Dal.Capture(filename)).Page(index, size);
        }

        public int InsertEntity(COM.TIGER.PGIS.Model.Capture e)
        {
            return (new Dal.Capture()).AddEntity<Model.Capture>(e);
        }

        public int UpdateEntity(COM.TIGER.PGIS.Model.Capture e)
        {
            return (new Dal.Capture()).UpdateEntity<Model.Capture>(e);
        }

        public int DeleteEntities(params string[] ids)
        {
            return (new Dal.Capture()).DeleteEntities<Model.Capture>(ids);
        }

        public List<Model.CaptureType> GetTypes(string filename)
        {
            return (new Dal.Capture(filename)).GetTypes();
        }

        public int InsertType(string filename, Model.CaptureType e)
        {
            return (new Dal.Capture(filename)).InsertType(e);
        }

        public int UpdateType(string filename, Model.CaptureType e)
        {
            return (new Dal.Capture(filename)).UpdateType(e);
        }

        public int DeleteTypes(string filename, params string[] ids)
        {
            return (new Dal.Capture(filename)).DeleteTypes(ids);
        }

        public List<Model.CaptureType> GetCaptureForTree(string filename)
        {
            return (new Dal.Capture(filename)).GetCaptureForTree();
        }
    }
}
