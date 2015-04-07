using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Company
{
    /// <summary>
    /// CompanyHelp 的摘要说明
    /// </summary>
    public class CompanyHelp : PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.ICompany))]
        private IFun.ICompany _instance = null;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch(context.Request["req"])
            {
                case "pg":
                    PageCompanies();
                    break;
                case "add":
                    AddCompany();
                    break;
                case "upd":
                    UpdateCompany();
                    break;
                case "del":
                    DeleteCompanys();
                    break;
                case "pgcomps":
                    PageCompanys();
                    break;
                case "kind":
                    GetCompanyTypes();
                    break;
                case "kadd":
                    AddKind();
                    break;
                case "genre":
                    GetCompanyGenres();
                    break;
                case "gadd":
                    AddGenre();
                    break;
                case "trade":
                    GetCompanyTrades();
                    break;
                case "tadd":
                    AddTrade();
                    break;
                case "pupd":
                    UpdateParam();
                    break;
                case "pdel":
                    DeleteParams();
                    break;
                case "qform":
                    QueryCompany();
                    break;
                default:
                    break;
            }
        }

        private void PageCompanies()
        {
            var query = HttpContext.Current.Request["query"];
            var data = _instance.PageCompanies(query, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void QueryCompany()
        {
            var name = HttpContext.Current.Request["Name"];
            var addr = HttpContext.Current.Request["Addr"];

            var data = _instance.QueryCompany(name, addr, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void DeleteParams()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteParams(ids);
            ExecuteObj(data);
        }

        private void UpdateParam()
        {
            var e = GetQueryParamsCollection<Model.MParam>();
            var data = _instance.UpdateParam(e);
            ExecuteObj(data);
        }

        private void AddTrade()
        {
            var e = GetQueryParamsCollection<Model.MParam>();
            var data = _instance.AddTrade(e);
            ExecuteObj(data);
        }

        private void AddGenre()
        {
            var e = GetQueryParamsCollection<Model.MParam>();
            var data = _instance.AddGenre(e);
            ExecuteObj(data);
        }

        private void AddKind()
        {
            var e = GetQueryParamsCollection<Model.MParam>();
            var data = _instance.AddKind(e);
            ExecuteObj(data);
        }

        private void PageCompanys()
        {
            var data = _instance.PageCompanys(CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void GetCompanyTrades()
        {
            var data = _instance.GetCompanyTrades();
            ExecuteSerialzor(data);
        }

        private void GetCompanyGenres()
        {
            var data = _instance.GetCompanyGenres();
            ExecuteSerialzor(data);
        }

        private void GetCompanyTypes()
        {
            var data = _instance.GetCompanyTypes();
            ExecuteSerialzor(data);
        }

        private void DeleteCompanys()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteCompanys(ids);
            ExecuteObj(data);
        }

        private void UpdateCompany()
        {
            var e = GetQueryParamsCollection<Model.MCompany>();
            var data = _instance.UpdateCompay(e);
            ExecuteObj(data);
        }

        private void AddCompany()
        {
            var e = GetQueryParamsCollection<Model.MCompany>();
            var data = _instance.AddCompany(e);
            ExecuteObj(data);
        }

        public new bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}