using OSGeo.OGR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Common.Gis
{
    public class GeoHelper
    {
        private static GeoHelper helper = new GeoHelper();
        private GeoHelper()
        {
            OSGeo.OGR.Ogr.RegisterAll();
        }

        public static GeoHelper Instance
        {
            get
            {
                return helper;
            }
        }

        /// <summary>
        /// 判断是否在多边形内
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="coords"></param>
        /// <returns></returns>
        public bool PointInPolygon(double x, double y, string coords)
        {
            string _coords = this.CoordsToWKTStyle(coords);
            Geometry geoPolygon = Geometry.CreateFromWkt(string.Format("polygon (({0}))", _coords));
            geoPolygon.CloseRings();
            Geometry geoPolyline = Geometry.CreateFromWkt(string.Format("linestring ({0})", _coords));
            Geometry geoPoint = Geometry.CreateFromWkt(string.Format("point ({0} {1})", x, y));

            bool flag = geoPolygon.Contains(geoPoint) || geoPoint.Intersect(geoPolyline);
            geoPolygon.Dispose();
            geoPoint.Dispose();
            geoPolyline.Dispose();
            return flag;
        }

        private string CoordsToWKTStyle(string coords)
        {
            string newCoords = "";
            string[] arrCoords = coords.Split(',');
            if (arrCoords.Length <= 4)
            {
                return "empty";
            }
            for (int i = 0; i <= arrCoords.Length - 2; i = i + 2)
            {
                newCoords += string.Format("{0} {1},", arrCoords[i], Convert.ToDouble(arrCoords[i + 1]));
            }

            return newCoords.Trim(',');

        }
    }
}
