using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 警员信息接口
    /// </summary>
    public interface IOfficer
    {
        int InsertEntity(Model.MOfficer e);

        int UpdateEntity(Model.MOfficer e);

        int DeleteEntities(params string[] ids);

        Model.TotalClass<List<Model.MOfficer>> Page(int index, int size);

        List<Model.MOfficer> GetEntities();
    }
}
