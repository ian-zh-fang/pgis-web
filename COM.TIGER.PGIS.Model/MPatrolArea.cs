using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "PatrolArea", ModelName = "PatrolAreas")]
    [System.Runtime.Serialization.DataContract(Name = "PatrolArea", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MPatrolArea:MBase
    {
        private int _id;
        private string _name;
        private string _manager;
        private string _phone;
        private string _remark;
        private string _coordinates;
        private float _centerx;
        private float _centery;
        private string _color;
        private bool _leaf = true;

        /// <summary>
        /// 主键
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Id")]
        public int Id
        {
            get { return _id; }
            set { _id = value; }
        }
        /// <summary>
        /// 巡防区域名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }
        /// <summary>
        /// 巡防区域管理员
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Manager")]
        public string Manager
        {
            get { return _manager; }
            set { _manager = value; }
        }
        /// <summary>
        /// 联系电话
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Phone")]
        public string Phone
        {
            get { return _phone; }
            set { _phone = value; }
        }
        /// <summary>
        /// 巡防区域备注
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Remark")]
        public string Remark
        {
            get { return _remark; }
            set { _remark = value; }
        }
        /// <summary>
        /// 坐标串
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Coordinates")]
        public string Coordinates
        {
            get { return _coordinates; }
            set 
            { 
                _coordinates = value;
                GetCenterCoordinate(value, out _centerx, out _centery);
            }
        }
        /// <summary>
        /// X坐标
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Centerx")]
        public float Centerx
        {
            get { return _centerx; }
            set { _centerx = value; }
        }
        /// <summary>
        /// Y坐标
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Centery")]
        public float Centery
        {
            get { return _centery; }
            set { _centery = value; }
        }
        /// <summary>
        /// 颜色
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Color")]
        public string Color
        {
            get { return _color; }
            set { _color = value; }
        }

        [System.Runtime.Serialization.DataMember(Name = "text")]
        public string Text { get { return Name; } }

        /// <summary>
        /// 叶节点
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "leaf")]
        public bool leaf
        {
            get { return _leaf; }
        }
        [System.Runtime.Serialization.DataMember(Name = "expend")]
        public bool Expend { get { return true; } }
    }
}
