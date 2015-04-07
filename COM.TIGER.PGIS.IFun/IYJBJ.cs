using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    public interface IYJBJ
    {
        Model.TotalClass<List<Model.MYJBJ>> Page(string alarmnum, string alarmname, string alarmtel, string alarmaddress,
            DateTime? timestart, DateTime? timeend,
            int index, int size);

        List<Model.MYJBJ> DistributedQuery(DateTime timestart);

        List<Model.MYJBJ> MatchAddress(string addr);

        List<Model.MCaseTotal> TotalCase(int adminid);

        Model.MCaseTotal JDJTotalCaseOn();

        List<Model.MCaseTotal> JDdTotalCasesOnArea();

        Model.MCaseTotal YJTotalCaseOn();

        List<Model.MCaseTotal> YJTotalCasesOnArea();
    }
}
