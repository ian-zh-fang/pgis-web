using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.Statistics
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IStatistics))]
    public class Statistics:IFun.IStatistics
    {
        private Dal.DStatistics _instance = new Dal.DStatistics();

        public List<object> CountCase()
        {
            return _instance.CountCase();
        }

        public List<object> CountCompany()
        {
            return _instance.CountCompany();
        }

        public List<object> CountHotel()
        {
            return _instance.CountHotel();
        }

        public List<object> CountMonitor()
        {
            return _instance.CountMonitor();
        }

        public List<object> CountPopulation()
        {
            return _instance.CountPopulation();
        }
    }
}
