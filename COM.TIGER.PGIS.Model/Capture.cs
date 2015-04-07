using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Capture", ModelName = "Captures")]
    [System.Runtime.Serialization.DataContract(Name = "capture", Namespace = "http://www.tiger.com/pgis/model/")]
    public class Capture:MBase
    {
        private string _coords = null;
        private float _x = 0.0f;
        private float _y = 0.0f;

        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

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

        [System.Runtime.Serialization.DataMember(Name = "Type")]
        public int Type { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "X")]
        public float X
        {
            get { return _x; }
            set { _x = value; }
        }

        [System.Runtime.Serialization.DataMember(Name = "Y")]
        public float Y
        {
            get { return _y; }
            set { _y = value; }
        }

        [System.Runtime.Serialization.DataMember(Name = "Remark")]
        public string Remark { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "TypeInfo")]
        public CaptureType TypeInfo { get; set; }

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
    }

    [Common.Attr.RemoteController(ControllerName = "CaptureType", ModelName = "CaptureTypes")]
    [System.Runtime.Serialization.DataContract(Name = "capturetype", Namespace = "http://www.tiger.com/pgis/model/")]
    public class CaptureType:MBase, IComparable<CaptureType>
    {
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "IconCls")]
        public string IconCls { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "Color")]
        public string Color { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "Type")]
        public int Type { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "Remark")]
        public string Remark { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "Sort")]
        public int Sort { get; set; }

        /// <summary>
        /// 用于处理树形结构，标识是否是叶子节点
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "leaf")]
        [Common.Attr.CaptureInfo]
        public bool Leaf
        {
            get { return false; }
        }

        /// <summary>
        /// 用于处理树形结构，标识节点名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "text")]
        [Common.Attr.CaptureInfo]
        public string Text { get { return Name; } }

        private List<Capture> _captures = new List<Capture>();
        [System.Runtime.Serialization.DataMember(Name = "children")]
        [Common.Attr.CaptureInfo]
        public Capture[] Children
        {
            get
            {
                var arr = new Capture[_captures.Count];
                _captures.CopyTo(arr);
                return arr;
            }
            set
            {
                var temp = value.Where(t => !_captures.Exists(x => t.ID == x.ID));
                _captures.AddRange(temp);
            }
        }

        public void AddRange(IEnumerable<Capture> items)
        {
            if (items == null) return;
            if (items.Count() == 0) return;

            items = items.Where(t => t.Type == this.ID && !_captures.Exists(x => x.ID == t.ID));
            _captures.AddRange(items);
        }

        public int CompareTo(CaptureType other)
        {
            if (Type > other.Type) return -1;
            if (Type < other.Type) return 1;
            return 0;
        }
    }
}
