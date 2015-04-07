using COM.TIGER.PGIS.IFun;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn
{
    [Export(typeof(ILogger))]
    public class ConsoleLogger:ILogger
    {

        public string Write()
        {
            return "Console ";
        }
    }
}
