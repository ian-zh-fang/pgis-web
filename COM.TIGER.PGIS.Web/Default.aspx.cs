using COM.TIGER.PGIS.IFun;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace COM.TIGER.PGIS.Web
{
    public partial class Default : PageBase
    {
        [ImportMany]
        public IEnumerable<ILogger> Loggers;

        public string t = "";
        protected void Page_Load(object sender, EventArgs e)
        {
            //foreach (var logger in Loggers)
            //{
            //    t += logger.Write() + "；";
            //}
            //this.test.InnerHtml = t;
        }
    }
}