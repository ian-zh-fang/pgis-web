using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using COM.TIGER.PGIS.Common.Gis;

namespace UnitTestProject.GIS
{
    [TestClass]
    public class GISUnitTest
    {
        [TestMethod]
        public void TestGeoHelper()
        {
            double x = 10730,y=15118;
            string coords = "10146,14808,10416,15006,10448,15246,10654,15204,10852,14880,11072,14742,11332,15108,11312,15164,11150,15484,10420,15534,10300,15498,10232,15400,10088,15278,10182,15152,10184,15030,10016,14912,10050,14792";
            GeoHelper.Instance.PointInPolygon(x, y, coords);
        }
    }
}
