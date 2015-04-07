using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    public interface IAJJBXX
    {
        Model.TotalClass<List<Model.AJJBXX>> Query(string bh, string xm, string cnb, int isdrup, int ispursuit, int isarrest, int index, int size);

        List<Model.AJJBXX> QueryByBH(string bh);

        List<Model.MCountCase> TotalCase();
    }
}
