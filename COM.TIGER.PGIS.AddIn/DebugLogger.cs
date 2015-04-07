using COM.TIGER.PGIS.IFun;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;

namespace com.tiger.PGIS.AddIn
{
    [Export(typeof(ILogger))]
    public class DebugLogger : ILogger
    {
        public string Write()
        {
            return "Debuger";
        }
    }
}
