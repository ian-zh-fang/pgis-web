using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace COM.TIGER.PGIS.AddIn.CompanyMark
{
    [System.ComponentModel.Composition.Export(typeof(IFun.ICompanyMark))]
    public class CompanyMark:IFun.ICompanyMark
    {

        public int InsertEntity(Model.MCompanyMark e)
        {
            return (new Dal.DCompanyMark()).AddEntity<Model.MCompanyMark>(e);
        }

        public Model.TotalClass<List<Model.MCompanyMark>> PagingCompanyMarks(int index, int size, int type)
        {
            return (new Dal.DCompanyMark()).PagingEntities<Model.MCompanyMark>(index, size,type);
        }

        public int DeleteEntities(params string[] ids)
        {
            return (new Dal.DCompanyMark()).DeleteEntities<Model.MCompanyMark>(ids);
        }
    }
}
