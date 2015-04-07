using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DStatistics:DBase
    {
        protected const string CONTROLLERNAME = "Statistics";

        public List<object> CountCase()
        {
            var records = Post<List<Model.MCountCase>>("CountCase", CONTROLLERNAME).Result;

            var list = new List<object>();
            records.GroupBy(t => t.ID).ToList().ForEach(t =>
            {
                var e = new StatisticsCase() { ID = 0, Name = "其他", JCJJJDB = 0, Records = 0, YJBJ = 0 };
                foreach (var x in t)
                {
                    e.ID = x.ID;
                    
                    if (!string.IsNullOrWhiteSpace(x.Name))
                        e.Name = x.Name;

                    e.Records += x.Records;

                    switch (x.Mod)
                    { 
                        case 1:
                            e.YJBJ += x.Records;
                            break;
                        case 2:
                            e.JCJJJDB += x.Records;
                            break;
                        default:
                            break;
                    }
                }
                list.Add(e);
            });

            if (list.Count == 0)
                list.Add(new StatisticsCase() { ID = 0, Name = "行政区划", JCJJJDB = 0, Records = 0, YJBJ = 0 });

            return list;
        }

        public List<object> CountCompany()
        {
            var records = Post<List<Model.MCountCompany>>("CountCompany", CONTROLLERNAME).Result;
            var list = new List<object>();
            records.ForEach(x =>
            {
                var e = new StatisticsCompany() { Name = "其他", ID = x.ID, Records = x.Records };

                if (!string.IsNullOrWhiteSpace(x.Name))
                    e.Name = x.Name;

                list.Add(e);
            });

            if (list.Count == 0)
                list.Add(new StatisticsCompany() { Name = "行政区划", ID = 0, Records = 0 });

            return list;
        }

        public List<object> CountHotel()
        {
            var records = Post<List<Model.MCountHotel>>("CountHotel", CONTROLLERNAME).Result;
            var list = new List<object>();
            records.ForEach(x =>
            {
                var e = new StatisticsHotel() { Name = "其他", ID = x.ID, Records = x.Records };

                if (!string.IsNullOrWhiteSpace(x.Name))
                    e.Name = x.Name;

                list.Add(e);
            });

            if (list.Count == 0)
                list.Add(new StatisticsHotel() { Name = "行政区划", ID = 0, Records = 0 });

            return list;
        }

        public List<object> CountMonitor()
        {
            var records = Post<List<Model.MCountMonitor>>("CountMonitor", CONTROLLERNAME).Result;
            var list = new List<object>();
            records.ForEach(x =>
            {
                var e = new StatisticsMonitor() { Name = "其他", ID = x.ID, Records = x.Records };

                if (!string.IsNullOrWhiteSpace(x.Name))
                    e.Name = x.Name;

                list.Add(e);
            });

            if (list.Count == 0)
                list.Add(new StatisticsMonitor() { Name = "行政区划", ID = 0, Records = 0 });

            return list;
        }

        public List<object> CountPopulation()
        {
            var records = Post<List<Model.MCountPopulation>>("CountPopulation", CONTROLLERNAME).Result;

            //首先找出同一个ID下的所有数据
            //根据LiveTypeID分组每一组数据

            var list = new List<object>();
            var arr = records.GroupBy(t => t.ID).ToList();
            arr.ForEach(x =>
            {
                var e = new StatisticsPopulation() { Name = "其他" };
                foreach (var a in x)
                { 
                    e.ID = a.ID;

                    if (!string.IsNullOrWhiteSpace(a.Name))
                        e.Name = a.Name;
                    
                    e.Records += a.Records;
                    switch (a.LiveTypeID)
                    { 
                        case 1:
                            e.Records1 = a.Records;
                            break;
                        case 2:
                            e.Records2 = a.Records;
                            break;
                        case 3:
                            e.Records3 = a.Records;
                            break;
                        case 4:
                            e.Records4 = a.Records;
                            break;
                        default:
                            e.Records5 += a.Records;
                            break;
                    }
                }
                list.Add(e);
            });

            if (list.Count == 0)
                list.Add(new StatisticsPopulation() { Name = "行政区划", ID = 0, Records = 0, Records1 = 0, Records2 = 0, Records3 = 0, Records4 = 0, Records5 = 0 });

            return list;
        }
    }

    public class StatisticsBase
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int Records { get; set; }

        public virtual string RecordsName { get { return string.Empty; } }
    }

    public class StatisticsPopulation : StatisticsBase
    {
        public int Records1 { get; set; }
        public int Records2 { get; set; }
        public int Records3 { get; set; }
        public int Records4 { get; set; }
        public int Records5 { get; set; }

        public string Records1Name { get { return "常住人口数"; } }
        public string Records2Name { get { return "暂住人口数"; } }
        public string Records3Name { get { return "重点人口数"; } }
        public string Records4Name { get { return "境外人口数"; } }
        public string Records5Name { get { return "其他人口数"; } }

        public override string RecordsName { get { return "实有人口数"; } }
    }

    public class StatisticsCompany : StatisticsBase
    {
        public override string RecordsName { get { return "单位总数"; } }        
    }

    public class StatisticsHotel : StatisticsBase
    {
        public override string RecordsName { get { return "酒店，宾馆，旅店总数"; } }        
    }

    public class StatisticsCase : StatisticsBase
    {
        public int YJBJ { get; set; }
        public int JCJJJDB { get; set; }

        public string YJBJName { get { return "一键报警"; } }
        public string JCJJJDBName { get { return "三台合一报警"; } }

        public override string RecordsName { get { return "报警总数"; } }
    }

    public class StatisticsMonitor : StatisticsBase
    {
        public override string RecordsName { get { return "监控设备总数"; } }
    }
}
