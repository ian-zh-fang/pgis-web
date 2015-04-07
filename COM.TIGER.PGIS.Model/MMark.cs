using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Mark", ModelName = "Marks")]
    [System.Runtime.Serialization.DataContract(Name = "mark", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MMark:MBase, IComparable<MMark>
    {
        /// <summary>
        /// 座标组
        /// </summary>
        private string _coords = string.Empty;

        //中心原点坐标
        private float _x = 0.0f;
        private float _y = 0.0f;

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
        /// 地图标注描述信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Description")]
        public string Description { get; set; }

        /// <summary>
        /// 用于处理树形结构，标识是否是叶子节点
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "leaf")]
        public bool Leaf
        {
            get { return true; }
        }

        /// <summary>
        /// 用于处理树形结构，标识节点名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "text")]
        public string Text { get { return Name; } }

        /// <summary>
        /// 标注类型ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "MarkTypeID")]
        public int MarkTypeID { get; set; }

        /// <summary>
        /// 标注类型
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "MarkType")]
        public MMarkType MarkType { get; set; }

        public int CompareTo(MMark other)
        {
            if (ID > other.ID) return 1;
            if (ID < other.ID) return -1;
            return 0;
        }


    }

    [Common.Attr.RemoteController(ControllerName = "Tag", ModelName = "Tags")]
    [System.Runtime.Serialization.DataContract(Name = "markex", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MMarkEx : MMark
    {
        [System.Runtime.Serialization.DataMember(Name = "expend")]
        public bool Expend { get { return true; } }

        [System.Runtime.Serialization.DataMember(Name="checked")]
        public bool CheckBox { get { return false; } }
    }
}
