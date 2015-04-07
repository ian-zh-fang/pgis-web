using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    public interface IFunBasic
    {
    }

    public interface IFunBasic<T> : IFunBasic where T : new()
    {
        int AddEntity(T t);

        int UpdateEntity(T t);

        int DeleteEntities(params string[] ids);
    }
}
