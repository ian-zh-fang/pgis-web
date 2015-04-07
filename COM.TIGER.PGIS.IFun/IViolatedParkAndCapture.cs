using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    public interface IViolatedParkAndCapture
    {
        Model.TotalClass<List<Model.Capture>> Pagging(string filename, int index, int size);

        int InsertEntity(Model.Capture e);

        int UpdateEntity(Model.Capture e);

        int DeleteEntities(params string[] ids);

        List<Model.CaptureType> GetTypes(string filename);

        int InsertType(string filename, Model.CaptureType e);

        int UpdateType(string filename, Model.CaptureType e);

        int DeleteTypes(string filename, params string[] ids);

        List<Model.CaptureType> GetCaptureForTree(string filename);
    }
}
