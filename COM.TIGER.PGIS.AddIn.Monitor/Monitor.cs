using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.Monitor
{
    /// <summary>
    /// 监控
    /// </summary>
    [System.ComponentModel.Composition.Export(typeof(IFun.IMonitor))]
    public class Monitor:IFun.IMonitor
    {
        Dal.DMonitor _handler = new Dal.DMonitor();

        public int AddType(Model.MParam e)
        {
            return _handler.AddType(e);
        }

        public int UpdateType(Model.MParam e)
        {
            return _handler.UpdateType(e);
        }

        public int DeleteTypes(params string[] ids)
        {
            return _handler.DeleteTypes(ids);
        }

        public int AddDoType(Model.MParam e)
        {
            return _handler.AddDoType(e);
        }

        public int UpdateDoType(Model.MParam e)
        {
            return _handler.UpdateDoType(e);
        }

        public int DeleteDoTypes(params string[] ids)
        {
            return _handler.DeleteDoTypes(ids);
        }

        public List<Model.MParam> GetTypes()
        {
            return _handler.GetTypes();
        }

        public List<Model.MParam> GetDoTypes()
        {
            return _handler.GetDoTypes();
        }

        public int AddDevice(Model.MMonitorDevice e)
        {
            return _handler.AddDevice(e);
        }

        public int UpdateDevice(Model.MMonitorDevice e)
        {
            return _handler.UpdateDevice(e);
        }

        public int DeleteDevices(params string[] ids)
        {
            return _handler.DeleteDevices(ids);
        }

        public Model.TotalClass<List<Model.MMonitorDevice>> Page(int index, int size)
        {
            return _handler.Page(index, size);
        }

        public Model.TotalClass<List<Model.MMonitorDevice>> PageQuery(string name, string num, int dotypeid, string address, int index, int size)
        {
            return _handler.PageQuery(name, num, dotypeid, address, index, size);
        }

        public List<Model.MAddress> Match(string pattern)
        {
            return _handler.Match(pattern);
        }
        
        public List<Model.MMonitorDevice> Query(string coords)
        {
            return _handler.Query(coords);
        }
    }
}
