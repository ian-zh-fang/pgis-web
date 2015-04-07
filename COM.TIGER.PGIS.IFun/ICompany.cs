using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 单位
    /// </summary>
    public interface ICompany
    {
        int AddCompany(Model.MCompany e);

        int UpdateCompay(Model.MCompany e);

        int DeleteCompanys(params string[] ids);

        int AddKind(Model.MParam e);

        int AddGenre(Model.MParam e);

        int AddTrade(Model.MParam e);

        int UpdateParam(Model.MParam e);

        int DeleteParams(params string[] ids);

        Model.TotalClass<List<Model.MCompany>> PageCompanys(int index, int size);

        Model.TotalClass<List<Model.MCompany>> PageCompanies(string query, int index, int size);

        Model.TotalClass<List<Model.MCompany>> QueryCompany(string name, string addr, int index, int size);
 
        List<Model.MParam> GetCompanyTrades();

        List<Model.MParam> GetCompanyGenres();

        List<Model.MParam> GetCompanyTypes();
    }
}
