using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DYJBJ:DBase
    {
        public COM.TIGER.PGIS.Model.TotalClass<List<COM.TIGER.PGIS.Model.MYJBJ>> Page(string alarmnum, string alarmname, string alarmtel, string alarmaddress, 
            DateTime? timestart, DateTime? timeend, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MYJBJ>>>("Page", "YJBJ",
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
            return Post<List<Model.MCaseTotal>>("TotalCase", "YJBJ", string.Format("adminid={0}", adminid)).Result;
        }

        public List<Model.MYJBJ> DistributedQuery(DateTime timestart)
        {
            return Post<List<Model.MYJBJ>>("DistributedQuery", "YJBJ", string.Format("timestart={0}", timestart)).Result;
        }

        public List<Model.MYJBJ> MatchAddress(string addr)
        {
            return Post<List<Model.MYJBJ>>("MatchAddress", "YJBJ", string.Format("addr={0}", addr)).Result;
        }

        public Model.MCaseTotal JDJTotalCaseOn()
        {
            return Post<Model.MCaseTotal>("JDJTotalCaseOn", "YJBJ").Result;
        }

        public List<Model.MCaseTotal> JDdTotalCasesOnArea()
        {
            return Post<List<Model.MCaseTotal>>("JDdTotalCasesOnArea", "YJBJ").Result;
        }

        public Model.MCaseTotal YJTotalCaseOn()
        {
            return Post<Model.MCaseTotal>("YJTotalCaseOn", "YJBJ").Result;
        }

        public List<Model.MCaseTotal> YJTotalCasesOnArea()
        {
            return Post<List<Model.MCaseTotal>>("YJTotalCasesOnArea", "YJBJ").Result;
        }
    }
}
