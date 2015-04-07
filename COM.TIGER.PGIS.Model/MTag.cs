using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{

    [System.Runtime.Serialization.DataContract(Name = "tag", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MTag:MBase,IComparable<MTag>
    {
        /// <summary>
        /// 标识符
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 标注的名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

        private string _coords = string.Empty;
        private float _x = 0.0f;
        private float _y = 0.0f;
        /// <summary>
        /// 只有在标注为线和面时，才能起作用，标识标注在地图上的一系列坐标
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Coordinates")]
        public string Coordinates
        {
            get { return _coords; }
            set
            {
                _coords = value;
                GetCenterCoordinate(_coords, out _x, out _y);
            }
        }

        /// <summary>
        /// 标识标注的中心点，以矩形方式计算宽高，如果标注为一个点，那么表示该点的横坐标
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "X")]
        public float X { get { return _x; } set { _x = value; } }

        /// <summary>
        /// 标识标注的中心点，以矩形方式计算宽高，如果标注为一个点，那么表示该点的纵坐标
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Y")]
        public float Y { get { return _y; } set { _y = value; } }

        /// <summary>
        /// 只有在标注为线和面时，才能起作用，标识标注的颜色
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Color")]
        public string Color { get; set; }

        /// <summary>
        /// 当前标注为点时有效，标识当前标注显示在地图上的图标
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "IconCls")]
        public string IconCls { get; set; }

        /// <summary>
        /// 地图标注类型。
        /// <para>1表示点，2表示线，3表示面</para>
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Type")]
        public int Type { get; set; }

        /// <summary>
        /// 地图标注描述信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Description")]
        public string Description { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "text")]
        public string Text { get { return Name; } }

        [System.Runtime.Serialization.DataMember(Name = "expend")]
        public bool Expend { get { return true; } }

        [System.Runtime.Serialization.DataMember(Name = "leaf")]
        public bool Leaf { get { return true; } }

        public int CompareTo(MTag other)
        {
            if (ID > other.ID) return 1;
            if (ID < other.ID) return -1;
            return 0;
        }
    }
}
