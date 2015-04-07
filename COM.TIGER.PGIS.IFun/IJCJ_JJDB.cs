using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    public interface IJCJ_JJDB
    {
        Model.TotalClass<List<Model.MJCJ_JJDB>> Page(string alarmnum, string alarmname, string alarmtel, string alarmaddress,
            DateTime? timestart, DateTime? timeend,
            int index, int size);

        List<Model.MJCJ_JJDB> DistributedQuery(DateTime timestart);

        List<Model.MJCJ_JJDB> MatchAddress(string addr);

        List<Model.MCaseTotal> TotalCase(int adminid);
    }
}
