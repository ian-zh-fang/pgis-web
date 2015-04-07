using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.JCJ_JJDB
{
    /// <summary>
    /// 案件  三台合一
    /// </summary>
    [System.ComponentModel.Composition.Export(typeof(IFun.IJCJ_JJDB))]
    public class JCJ_JJDB:IFun.IJCJ_JJDB
    {
        public List<COM.TIGER.PGIS.Model.MCaseTotal> TotalCase(int adminid)
        {
            return (new Dal.DJCJ_JJDB()).TotalCase(adminid);
        }

        public Model.TotalClass<List<Model.MJCJ_JJDB>> Page(string alarmnum, string alarmname, string alarmtel, string alarmaddress, DateTime? timestart, DateTime? timeend, int index, int size)
        {
            return (new Dal.DJCJ_JJDB()).Page(alarmnum, alarmname, alarmtel, alarmaddress, timestart, timeend, index, size);
        }

        public List<Model.MJCJ_JJDB> DistributedQuery(DateTime timestart)
        {
            return (new Dal.DJCJ_JJDB()).DistributedQuery(timestart);
        }

        public List<Model.MJCJ_JJDB> MatchAddress(string addr)
        {
            return (new Dal.DJCJ_JJDB()).MatchAddress(addr);
        }
    }
}
