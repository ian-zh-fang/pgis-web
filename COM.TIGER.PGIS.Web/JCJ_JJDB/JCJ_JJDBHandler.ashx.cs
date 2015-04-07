using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.JCJ_JJDB
{
    /// <summary>
    /// CaseHandler 的摘要说明
    /// </summary>
    public class JCJ_JJDBHandler : PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IJCJ_JJDB))]
        IFun.IJCJ_JJDB _instance;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "1":
                    FormQuery();
                    break;
                case "2":
                    TotalCases();
                    break;
                case "3":
                    //案件分布
                    Distributed();
                    break;
                case "addr":
                    //自动匹配地址
                    MatchAddress();
                    break;
                default:
                    break;
            }
        }

        private void Distributed()
        {
            var c = HttpContext.Current;
            DateTime timestart = DateTime.Parse(HttpContext.Current.Request["timestart"]);
            var data = _instance.DistributedQuery(timestart);
            Execute(c, data, true);
        }

        private void MatchAddress()
        {
            var addr = HttpContext.Current.Request["query"];
            var data = _instance.MatchAddress(addr);
            Execute(HttpContext.Current, data, true);
        }

        private void TotalCases()
        {
            var c = HttpContext.Current;
            var adminid = int.Parse(c.Request["adminid"]);
            var data = _instance.TotalCase(adminid);
            Execute(c, data, true);
        }

        private void FormQuery()
        {
            //@params string alarmname, string alarmtel, string alarmaddress, DateTime? timestart, DateTime? timeend, int index, int size
            var c = HttpContext.Current;
            var request = c.Request;
            var alarmnum = request["Num"];
            var alarmname = request["AlarmMan"];
            var alarmtel = request["Tel"];
            var alarmaddress = request["Location"];
            DateTime? timestart = string.IsNullOrWhiteSpace(request["TimeStart"]) ? null : (DateTime?)(DateTime.Parse(request["TimeStart"]));
            DateTime? timeend = string.IsNullOrWhiteSpace(request["TimeEnd"]) ? null : (DateTime?)(DateTime.Parse(request["TimeEnd"]));
            int index = Convert.ToInt32(c.Request["start"]);
            int size = Convert.ToInt32(c.Request["limit"]);
            index = index / size + 1;
            var data = _instance.Page(alarmnum, alarmname, alarmtel, alarmaddress, timestart, timeend, index, size);
            Execute(c, data, true);
        }

        public new bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}