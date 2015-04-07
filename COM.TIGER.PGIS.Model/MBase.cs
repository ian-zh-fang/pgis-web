using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    /// <summary>
    /// 基础模型
    /// <para>模型中公用的方法，应该放置在此处。</para>
    /// </summary>
    public abstract class MBase
    {
        /// <summary>
        /// 获取平面中心原点座标
        /// </summary>
        /// <param name="value">
        /// 以逗号分隔的座标信息。
        /// <para>例如：1，2，3，4，5，6</para>
        /// </param>
        /// <param name="x">中心原点横坐标</param>
        /// <param name="y">中心远点纵坐标</param>
        public virtual void GetCenterCoordinate(string value, out float x, out float y)
        {
            x = 0.0f;
            y = 0.0f;

            if (!string.IsNullOrWhiteSpace(value))
            {
                var items = from t in value.Split(',') select float.Parse(t);
                var xs = items.Where((t, index) => index % 2 == 0);
                var ys = items.Where((t, index) => index % 2 != 0);

                var xmin = xs.Min();
                var xmax = xs.Max();

                var ymin = ys.Min();
                var ymax = ys.Max();

                x = (xmin + xmax) / 2;
                y = (ymin + ymax) / 2;
            }
        }
    }
}
