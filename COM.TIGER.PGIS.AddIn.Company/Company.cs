using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.Company
{
    [System.ComponentModel.Composition.Export(typeof(IFun.ICompany))]
    public class Company : IFun.ICompany
    {
        private Dal.DCompany _instance = new Dal.DCompany();

        public int AddCompany(Model.MCompany e)
        {
            return _instance.AddEntity<Model.MCompany>(e);
        }

        public int UpdateCompay(Model.MCompany e)
        {
            return _instance.UpdateEntity<Model.MCompany>(e);
        }

        public int DeleteCompanys(params string[] ids)
        {
            return _instance.DeleteEntities<Model.MCompany>(ids);
        }
        
        public int AddKind(Model.MParam e)
        {
            return _instance.AddKind(e);
        }

        public int AddGenre(Model.MParam e)
        {
            return _instance.AddGenre(e);
        }

        public int AddTrade(Model.MParam e)
        {
            return _instance.AddTrade(e);
        }

        public int UpdateParam(Model.MParam e)
        {
            return _instance.UpdateParam(e);
        }

        public int DeleteParams(params string[] ids)
        {
            return _instance.DeleteParams(ids);
        }
        
        public Model.TotalClass<List<Model.MCompany>> PageCompanys(int index, int size)
        {
            return _instance.PagingEntities<Model.MCompany>(index, size);
        }
        
        public List<Model.MParam> GetCompanyTrades()
        {
            return _instance.GetCompanyTrades();
        }

        public List<Model.MParam> GetCompanyGenres()
        {
            return _instance.GetCompanyGenres();
        }

        public List<Model.MParam> GetCompanyTypes()
        {
            return _instance.GetCompanyTypes();
        }
        
        public Model.TotalClass<List<Model.MCompany>> QueryCompany(string name, string addr, int index, int size)
        {
            return _instance.QueryCompany(name, addr, index, size);
        }
        
        public Model.TotalClass<List<Model.MCompany>> PageCompanies(string query, int index, int size)
        {
            return _instance.PageCompanies(query, index, size);
        }
    }
}
