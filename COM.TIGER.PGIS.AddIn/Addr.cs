using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IAddr))]
    public class Addr : IFun.IAddr
    {
        private Dal.DAddress _instance = new Dal.DAddress();

        public List<Model.MAddress> Match(string pattern)
        {
            if (string.IsNullOrWhiteSpace(pattern))
                return new List<Model.MAddress>();

            return _instance.Match(pattern);
        }
    }
}
