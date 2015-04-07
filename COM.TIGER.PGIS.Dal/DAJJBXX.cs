using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DAJJBXX:DBase
    {
        protected const string CONTROLLNAME = "AJJBXX";

        public Model.TotalClass<List<Model.AJJBXX>> Query(string bh, string xm, string cnb, int isdrup, int ispursuit, int isarrest, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.AJJBXX>>>("Query", CONTROLLNAME,
                string.Format("bh={0}", bh),
                string.Format("xm={0}", xm),
                string.Format("cnb={0}", cnb),
                string.Format("isdrup={0}", isdrup),
                string.Format("ispursuit={0}", ispursuit),
                string.Format("isarrest={0}", isarrest),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public List<Model.AJJBXX> QueryByBH(string bh)
        {
            return Post<List<Model.AJJBXX>>("QueryByBH", CONTROLLNAME, string.Format("bh={0}", bh)).Result;
        }

        public List<Model.MCountCase> TotalCase()
        {
            return Post<List<Model.MCountCase>>("TotalCase", CONTROLLNAME).Result;
        }
    }
}
