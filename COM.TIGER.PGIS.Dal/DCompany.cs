using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DCompany:DBase
    {
        private const string CONTROLLERNAME = "Company";

        public int AddKind(Model.MParam e)
        {
            return Post<int>("AddKind", CONTROLLERNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int AddGenre(Model.MParam e)
        {
            return Post<int>("AddGenre", CONTROLLERNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int AddTrade(Model.MParam e)
        {
            return Post<int>("AddTrade", CONTROLLERNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdateParam(Model.MParam e)
        {
            return Post<int>("UpdateParam", CONTROLLERNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeleteParams(params string[] ids)
        {
            return Post<int>("DeleteParams", CONTROLLERNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public List<Model.MParam> GetCompanyTrades()
        {
            return Post<List<Model.MParam>>("GetCompanyTrades", CONTROLLERNAME).Result;
        }

        public List<Model.MParam> GetCompanyGenres()
        {
            return Post<List<Model.MParam>>("GetCompanyGenres", CONTROLLERNAME).Result;
        }

        public List<Model.MParam> GetCompanyTypes()
        {
            return Post<List<Model.MParam>>("GetCompanyTypes", CONTROLLERNAME).Result;
        }

        public Model.TotalClass<List<Model.MCompany>> QueryCompany(string name, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MCompany>>>("QueryCompany", CONTROLLERNAME,
                string.Format("name={0}", name),
                string.Format("addr={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }
        
        public Model.TotalClass<List<Model.MCompany>> PageCompanies(string query, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MCompany>>>("PageCompanies", CONTROLLERNAME,
                string.Format("query={0}", query),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }
    }
}
