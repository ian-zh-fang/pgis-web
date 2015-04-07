using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.YJBJ
{
    /// <summary>
    /// 案件  一键报警
    /// </summary>
    [System.ComponentModel.Composition.Export(typeof(IFun.IYJBJ))]
    public class YJBJ:IFun.IYJBJ
    {
        public Model.TotalClass<List<Model.MYJBJ>> Page(string alarmnum, string alarmname, string alarmtel, string alarmaddress, 
            DateTime? timestart, DateTime? timeend, int index, int size)
        {
            return (new Dal.DYJBJ()).Page(alarmnum, alarmname, alarmtel, alarmaddress, timestart, timeend, index, size);
        }

        public List<Model.MCaseTotal> TotalCase(int adminid)
        {
            return (new Dal.DYJBJ()).TotalCase(adminid);
        }


        public List<Model.MYJBJ> DistributedQuery(DateTime timestart)
        {
            return (new Dal.DYJBJ()).DistributedQuery(timestart);
        }


        public List<Model.MYJBJ> MatchAddress(string addr)
        {
            return (new Dal.DYJBJ()).MatchAddress(addr);
        }


        public Model.MCaseTotal JDJTotalCaseOn()
        {
            return (new Dal.DYJBJ()).JDJTotalCaseOn();
        }

        public List<Model.MCaseTotal> JDdTotalCasesOnArea()
        {
            return (new Dal.DYJBJ()).JDdTotalCasesOnArea();
        }

        public Model.MCaseTotal YJTotalCaseOn()
        {
            return (new Dal.DYJBJ()).YJTotalCaseOn();
        }

        public List<Model.MCaseTotal> YJTotalCasesOnArea()
        {
            return (new Dal.DYJBJ()).YJTotalCasesOnArea();
        }
    }
}
