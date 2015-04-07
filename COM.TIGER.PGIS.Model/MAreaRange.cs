using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Range", ModelName = "Ranges")]
    [System.Runtime.Serialization.DataContract(Name = "arearange", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MAreaRange:MBase
    {
        private float _x = 0.0f;
        private float _y = 0.0f;
        private string _range = string.Empty;

        /// <summary>
        /// 范围标识符
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 当前范围范围座标组
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Range")]
        public string Range {
            get { return _range; }
            set {
                _range = value;
                GetCenterCoordinate(_range, out _x, out _y);
            }
        }

        /// <summary>
        /// 当前范围中心原点座标横坐标值
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "X")]
        public float X {
            get {
                return _x;
            }
            set { _x = value; }
        }

        /// <summary>
        /// 当前范围中心原点座标横坐标值
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Y")]
        public float Y {
            get {
                return _y;
            }
            set { _y = value; }
        }

        /// <summary>
        /// 当前范围在地图中显示的颜色
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Color")]
        public string Color { get; set; }

        /// <summary>
        /// 当前范围隶属于哪一个区域
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "AreaID")]
        public int AreaID { get; set; }
    }
}
