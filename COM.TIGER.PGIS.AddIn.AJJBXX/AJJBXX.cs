using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace COM.TIGER.PGIS.AddIn.AJJBXX
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IAJJBXX))]
    public class AJJBXX:IFun.IAJJBXX
    {
        private Dal.DAJJBXX _instance = new Dal.DAJJBXX();

        public Model.TotalClass<List<Model.AJJBXX>> Query(string bh, string xm, string cnb, int isdrup, int ispursuit, int isarrest, int index, int size)
        {
            return _instance.Query(bh, xm, cnb, isdrup, ispursuit, isarrest, index, size);
        }

        public List<Model.AJJBXX> QueryByBH(string bh)
        {
            return _instance.QueryByBH(bh);
        }

        public List<Model.MCountCase> TotalCase()
        {
            return _instance.TotalCase();
        }
    }
}
