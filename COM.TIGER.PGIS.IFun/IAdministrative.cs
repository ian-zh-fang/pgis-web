using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 行政区划管理
    /// </summary>
    public interface IAdministrative
    {
        Model.TotalClass<List<Model.MAdministrative>> Pagging(int index, int size);

        Model.TotalClass<List<Model.MAdministrative>> PageTop(int index, int size);

        Model.TotalClass<List<Model.MAdministrative>> PageSub(int id, int index, int size);

        List<Model.MAdministrative> GetAdministrativeTree();

        int AddEntity(Model.MAdministrative e);

        int UpdateEntity(Model.MAdministrative e);

        int DeleteEntities(params string[] ids);
    }
}
