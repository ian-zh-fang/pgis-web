using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Employee
{
    /// <summary>
    /// EmployeeHelp 的摘要说明
    /// </summary>
    public class EmployeeHelp : PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IEmployee))]
        private IFun.IEmployee _instance = null;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            { 
                case "qform":
                    //@ 表单查询从业人员信息
                    QueryEmployees();
                    break;
                case "getoncompnay":
                    //@ 前端查询单位从业人员
                    QueryEmployeesOnCompany();
                    break;
                case "getonhotel":
                    //@ 前端查询酒店，宾馆，旅店从业人员
                    QueryEmployeesOnHotel();
                    break;
                case "company":
                    //@ 单位从业人员
                    GetEmployeesOnCompany();
                    break;
                case "qcompany":
                    //@ 单位离职人员
                    GetQuitEmployeesOnCompany();
                    break;
                case "hotel":
                    //@ 酒店从业人员
                    GetEmployeesOnHotel();
                    break;
                case "qhotel":
                    //@ 酒店离职人员
                    GetQuitEmployeesOnHotel();
                    break;
                default:
                    break;
            }
        }

        //@ 酒店从业人员
        private void GetQuitEmployeesOnHotel()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.GetQuitEmployeesOnHotel(id, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 酒店离职人员
        private void GetEmployeesOnHotel()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.GetEmployeesOnHotel(id, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 表单查询从业人员信息
        private void QueryEmployees()
        {
            var name = HttpContext.Current.Request["Name"];//@  员工姓名
            //var cardtpid = HttpContext.Current.Request["CardTypeID"];//@  有效证件类型
            var cardnum = HttpContext.Current.Request["IdentityCardNum"];//@  有效证件编号
            var addr = HttpContext.Current.Request["Addr"];//@  住址

            var data = _instance.QueryEmployees(name, cardnum, addr, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 前端查询酒店，宾馆，旅店从业人员
        private void QueryEmployeesOnHotel()
        {
            var name = HttpContext.Current.Request["Name"];//@  员工姓名
            //var cardtpid = HttpContext.Current.Request["CardTypeID"];//@  有效证件类型
            var cardnum = HttpContext.Current.Request["IdentityCardNum"];//@  有效证件编号
            var addr = HttpContext.Current.Request["Addr"];//@  住址

            var data = _instance.QueryEmployeesOnHotel(name, cardnum, addr, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 表单查询从业人员信息
        private void QueryEmployeesOnCompany()
        {
            var name = HttpContext.Current.Request["Name"];//@  员工姓名
            //var cardtpid = HttpContext.Current.Request["CardTypeID"];//@  有效证件类型
            var cardnum = HttpContext.Current.Request["IdentityCardNum"];//@  有效证件编号
            var addr = HttpContext.Current.Request["Addr"];//@  住址

            var data = _instance.QueryEmployeesOnCompany(name, cardnum, addr, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 单位从业人员
        private void GetEmployeesOnCompany()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.GetEmployeesOnCompany(id, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 单位离职人员
        private void GetQuitEmployeesOnCompany()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.GetQuitEmployeesOnCompany(id, CurrentPage, PagerSize);
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