using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    public interface IPatrolArea
    {
        List<Model.MPatrolArea> GetPatrolArea();

        Model.TotalClass<List<Model.MPatrolArea>> Page(int index, int size);

        int DeleteEntities<T>(params string[] ids);

        int UpdateEntity<T>(T t);

        int InsertEntity<T>(T t);

    }
}
