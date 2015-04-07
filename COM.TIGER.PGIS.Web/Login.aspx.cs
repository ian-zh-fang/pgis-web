using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace COM.TIGER.PGIS.Web
{
    public partial class Login : PageBase
    {
        [System.ComponentModel.Composition.Import(typeof(PGIS.IFun.ISys))]
        private PGIS.IFun.ISys _instance;

        protected void Page_Load(object sender, EventArgs e)
        {
            InitContainer(HttpContext.Current);
            if (!IsPostBack && !string.IsNullOrWhiteSpace(Request["req"]))
            {
                var statue = false;
                string msg = null;

                switch (CheckUser(Request["username"], Request["password"]))
                { 
                    case 1:
                        statue = true;
                        break;
                    case -1:
                        msg = "账户或者密码错误。";
                        break;
                    default:
                        msg = "用户不存在。";
                        break;
                }
                Execute(HttpContext.Current, new { statue = statue, msg = msg });
                HttpContext.Current.Response.End();
            }
        }

        private int CheckUser(string username, string password)
        {
            var user = _instance.CheckUser(username, password);
            if (user == null) return -1;
            
            //添加票据信息
            AddTicket(user);

            return 1;
        }

        private void AddTicket(Model.MUser user)
        {
            var ticket = GetTicket(user);
            var ticketStr = System.Web.Security.FormsAuthentication.Encrypt(ticket);
            var cookie = new System.Web.HttpCookie(System.Web.Security.FormsAuthentication.FormsCookieName, ticketStr);
            cookie.Expires = ticket.Expiration;
            HttpContext.Current.Response.Cookies.Add(cookie);
        }
    }
}