using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DJCJ_JJDB:DBase
    {
        public COM.TIGER.PGIS.Model.TotalClass<List<COM.TIGER.PGIS.Model.MJCJ_JJDB>> Page(string alarmnum, string alarmname, string alarmtel, string alarmaddress, 
            DateTime? timestart, DateTime? timeend, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MJCJ_JJDB>>>("Page", "JCJ_JJDB",
                string.Format("alarmnum={0}", alarmnum),
                string.Format("alarmname={0}", alarmname),
                string.Format("alarmtel={0}", alarmtel),
                string.Format("alarmaddress={0}", alarmaddress),
                string.Format("timestart={0}", timestart),
                string.Format("timeend={0}", timeend),
                //string.Format("timestart={0}", timestart == null ? string.Empty : ((DateTime)timestart).ToString("yyyy-MM-dd HH:mm:ss")),
                //string.Format("timeend={0}", timeend == null ? string.Empty : ((DateTime)timeend).ToString("yyyy-MM-dd HH:mm:ss")),
                string.Format("index={0}", index),
                string.Format("size={0}", size))
                .Result;
        }

        public List<COM.TIGER.PGIS.Model.MCaseTotal> TotalCase(int adminid)
        {
            return Post<List<Model.MCaseTotal>>("TotalCase", "JCJ_JJDB", string.Format("adminid={0}", adminid)).Result;
        }

        public List<Model.MJCJ_JJDB> DistributedQuery(DateTime timestart)
        {
            return Post<List<Model.MJCJ_JJDB>>("DistributedQuery", "JCJ_JJDB", string.Format("timestart={0}", timestart)).Result;
        }

        public List<Model.MJCJ_JJDB> MatchAddress(string addr)
        {
            return Post<List<Model.MJCJ_JJDB>>("MatchAddress", "JCJ_JJDB", string.Format("addr={0}", addr)).Result;
        }
    }
}
