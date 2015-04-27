using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DMonitor : DBase<Model.MMonitorDevice>
    {
        const string CONTROLLERNAME = "MonitorDevice";

        public int AddType(Model.MParam e)
        {
            return Post<int>("AddType", CONTROLLERNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdateType(Model.MParam e)
        {
            return Post<int>("UpdateType", CONTROLLERNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeleteTypes(params string[] ids)
        {
            if (ids.Length == 0) return 0;

            return Post<int>("DeleteTypes", CONTROLLERNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public int AddDoType(Model.MParam e)
        {
            return Post<int>("AddDoType", CONTROLLERNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdateDoType(Model.MParam e)
        {
            return Post<int>("UpdateDoType", CONTROLLERNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeleteDoTypes(params string[] ids)
        {
            if (ids.Length == 0) return 0;

            return Post<int>("DeleteDoTypes", CONTROLLERNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public List<Model.MParam> GetTypes()
        {
            return Post<List<Model.MParam>>("GetTypes", CONTROLLERNAME).Result;
        }

        public List<Model.MParam> GetDoTypes()
        {
            return Post<List<Model.MParam>>("GetDoTypes", CONTROLLERNAME).Result;
        }

        public int AddDevice(Model.MMonitorDevice e)
        {
            return Post<int>("AddDevice", CONTROLLERNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdateDevice(Model.MMonitorDevice e)
        {
            return Post<int>("UpdateDevice", CONTROLLERNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeleteDevices(params string[] ids)
        {
            if (ids.Length == 0) return 0;

            return Post<int>("DeleteDevices", CONTROLLERNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public Model.TotalClass<List<Model.MMonitorDevice>> Page(int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MMonitorDevice>>>("Page", CONTROLLERNAME,
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MMonitorDevice>> PageQuery(string name, string num, int dotypeid, string address, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MMonitorDevice>>>("PageQuery", CONTROLLERNAME,
                string.Format("name={0}", name),
                string.Format("num={0}", num),
                string.Format("dotypeid={0}", dotypeid),
                string.Format("address={0}", address),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public List<Model.MAddress> Match(string pattern)
        {
            return Post<List<Model.MAddress>>("Match", CONTROLLERNAME, string.Format("pattern={0}", pattern)).Result;
        }

        public List<Model.MMonitorDevice> Query(string coords)
        {
            return Post<List<Model.MMonitorDevice>>("Query", CONTROLLERNAME, string.Format("coords={0}", coords)).Result;
        }

        public List<Model.MMonitorDevice> AllDevices()
        {
            return Post<List<Model.MMonitorDevice>>("GetMonitorDevices", CONTROLLERNAME).Result;
        }
    }
}
