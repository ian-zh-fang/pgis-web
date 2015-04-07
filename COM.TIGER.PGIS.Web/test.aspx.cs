using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace COM.TIGER.PGIS.Web
{
    public partial class test : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            double x = 10730, y = 15118;
            string coords = "10146,14808,10416,15006,10448,15246,10654,15204,10852,14880,11072,14742,11332,15108,11312,15164,11150,15484,10420,15534,10300,15498,10232,15400,10088,15278,10182,15152,10184,15030,10016,14912,10050,14792";
            this.aa.InnerHtml = COM.TIGER.PGIS.Common.Gis.GeoHelper.Instance.PointInPolygon(x, y, coords).ToString();
        }
    }
}