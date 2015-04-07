using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    public interface IAddr
    {
        List<Model.MAddress> Match(string pattern);
    }
}
