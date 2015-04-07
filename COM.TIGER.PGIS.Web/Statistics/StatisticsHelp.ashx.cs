using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Statistics
{
    /// <summary>
    /// StatisticsHelp 的摘要说明
    /// </summary>
    public class StatisticsHelp : PageBase, IHttpHandler
    {

        [System.ComponentModel.Composition.Import(typeof(IFun.IStatistics))]
        private IFun.IStatistics _instance = null;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "popu":
                    CountPopulation();
                    break;
                case "monitor":
                    CountMonitor();
                    break;
                case "hotel":
                    CountHotel();
                    break;
                case "company":
                    CountCompany();
                    break;
                case "case":
                    CountCase();
                    break;
                default:
                    TestData();
                    break;
            }
        }

        private void CountCase()
        {
            var data = _instance.CountCase();
            ExecuteSerialzor(data);
        }

        private void CountCompany()
        {
            var data = _instance.CountCompany();
            ExecuteSerialzor(data);
        }

        private void CountHotel()
        {
            var data = _instance.CountHotel();
            ExecuteSerialzor(data);
        }

        private void CountMonitor()
        {
            var data = _instance.CountMonitor();
            ExecuteSerialzor(data);
        }

        private void CountPopulation()
        {
            var data = _instance.CountPopulation();
            ExecuteSerialzor(data);
        }

        private void TestData()
        {
            var data = new List<object>()
            {
                new {ID = 1, Name = "1", Records = 0, Records1 = 1, Records2 = 1, Records3 = 0, Records4 = 3 },
                new {ID = 2, Name = "2", Records = 1, Records1 = 1, Records2 = 1, Records3 = 1, Records4 = 4 },
                new {ID = 3, Name = "3", Records = 1, Records1 = 1, Records2 = 1, Records3 = 1, Records4 = 4 },
                new {ID = 3, Name = "3", Records = 1, Records1 = 0, Records2 = 1, Records3 = 1, Records4 = 4 },
                new {ID = 3, Name = "3", Records = 1, Records1 = 1, Records2 = 1, Records3 = 2, Records4 = 5 },
                new {ID = 3, Name = "3", Records = 1, Records1 = 0, Records2 = 1, Records3 = 1, Records4 = 4 },
                new {ID = 3, Name = "3", Records = 0, Records1 = 1, Records2 = 1, Records3 = 1, Records4 = 4 },
                new {ID = 3, Name = "3", Records = 1, Records1 = 1, Records2 = 1, Records3 = 4, Records4 = 7 },
                new {ID = 3, Name = "3", Records = 1, Records1 = 1, Records2 = 1, Records3 = 5, Records4 = 8 },
                new {ID = 3, Name = "3", Records = 1, Records1 = 1, Records2 = 1, Records3 = 1, Records4 = 4 }
            };

            ExecuteSerialzor(data);
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