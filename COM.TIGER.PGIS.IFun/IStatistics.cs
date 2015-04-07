using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 统计
    /// </summary>
    public interface IStatistics
    {
        List<object> CountCase();

        List<object> CountCompany();

        List<object> CountHotel();

        List<object> CountMonitor();

        List<object> CountPopulation();
    }
}
