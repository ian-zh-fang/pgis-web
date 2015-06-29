using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Population
{
    /// <summary>
    /// PopulationHelp 的摘要说明
    /// </summary>
    public class PopulationHelp :PageBase, IHttpHandler
    {

        [System.ComponentModel.Composition.Import(typeof(IFun.IPopulation))]
        IFun.IPopulation _instance = null;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            string req = context.Request["req"];
            switch (req)
            {
                case "pg":
                    PagePopulation();
                    break;
                case "sy":
                    GetSYPopulation();
                    break;
                case "ck":
                    GetCKPopulation();
                    break;
                case "zak":
                    GetZAKPopulation();
                    break;
                case "jw":
                    GetJWPopulation();
                    break;
                case "zhk":
                    GetZHKPopulation();
                    break;
                case "idcode":
                    //@ 获取指定身份证编号的
                    GetPopulationOnCode();
                    break;
                case "loc":
                    //@ 人员定位
                    LoactionPopu();
                    break;
                case "coords":
                    //@ 框选查询人口信息
                    GetKXPopulation();
                    break;
                case "maptheme":
                    //@ 主题地图
                    GetOnMaptheme();
                    break;
                default:
                    break;
            }
        }

        private void GetKXPopulation()
        {
            var coords = HttpContext.Current.Request["coords"];
            var data = _instance.GetKXPopulation(coords, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void LoactionPopu()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.LoactionPopu(id);
            ExecuteObj(data);
        }

        private void PagePopulation()
        {
            var query = HttpContext.Current.Request["query"];
            var data = _instance.PagePopulation(query, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 主题地图数据调用
        private void GetOnMaptheme()
        {
            var x1 = HttpContext.Current.Request["x1"];
            var y1 = HttpContext.Current.Request["y1"];
            var x2 = HttpContext.Current.Request["x2"];
            var y2 = HttpContext.Current.Request["y2"];
            var tp = HttpContext.Current.Request["tp"];
            var data = _instance.GetGroupByOwnerinfo(x1, y1, x2, y2, tp);
            ExecuteSerialzor(data);
        }

        private void GetPopulationOnCode()
        {
            var code = HttpContext.Current.Request["code"];
            var data = _instance.GetPopulationOnCode(code);
            ExecuteObj(data);
        }

        private void GetSYPopulation()
        {
            var request = HttpContext.Current.Request;
            var name = request["Name"];
            string cardno = request["CardNo"];
            string aliasname = request["AliasName"];
            var addr = request["Addr"];
            if (addr == "null")
                addr = string.Empty;

            var data = _instance.GetSYPopulation(name, addr, cardno, aliasname, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void GetCKPopulation()
        {
            var request = HttpContext.Current.Request;
            var name = request["Name"];
            var addr = request["Addr"];
            if (addr == "null")
                addr = string.Empty;

            var data = _instance.GetCKPopulation(name, addr, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void GetZAKPopulation()
        {
            var request = HttpContext.Current.Request;
            var name = request["Name"];
            var cno = request["CNo"];
            var hname = request["HName"];
            var addr = request["Addr"];
            if (addr == "null")
                addr = string.Empty;

            var data = _instance.GetZAKPopulation(name, cno, hname, addr, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void GetJWPopulation()
        {
            var request = HttpContext.Current.Request;
            var cname = request["CName"];
            var fname = request["FName"];
            var lname = request["LName"];
            var visaid = request["VisaID"];
            var portid = request["PortID"];
            var addr = request["Addr"];
            if (addr == "null")
                addr = string.Empty;

            var data = _instance.GetJWPopulation(cname, fname, lname, visaid, portid, addr, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void GetZHKPopulation()
        {
            var request = HttpContext.Current.Request;
            var name = request["Name"];
            var typeid = request["TypeID"];
            var addr = request["Addr"];
            if (addr == "null")
                addr = string.Empty;

            var data = _instance.GetZHKPopulation(name, typeid, addr, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
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