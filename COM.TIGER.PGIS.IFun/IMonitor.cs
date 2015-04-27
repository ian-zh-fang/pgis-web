using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 监控卡口
    /// </summary>
    public interface IMonitor
    {
        int AddType(Model.MParam e);

        int UpdateType(Model.MParam e);

        int DeleteTypes(params string[] ids);

        int AddDoType(Model.MParam e);

        int UpdateDoType(Model.MParam e);

        int DeleteDoTypes(params string[] ids);

        List<Model.MParam> GetTypes();

        List<Model.MParam> GetDoTypes();

        int AddDevice(Model.MMonitorDevice e);

        int UpdateDevice(Model.MMonitorDevice e);

        int DeleteDevices(params string[] ids);

        Model.TotalClass<List<Model.MMonitorDevice>> Page(int index, int size);

        Model.TotalClass<List<Model.MMonitorDevice>> PageQuery(string name, string num, int dotypeid, string address, int index, int size);

        List<Model.MMonitorDevice> AllDevices();

        List<Model.MAddress> Match(string pattern);

        List<Model.MMonitorDevice> Query(string coords);
    }
}
