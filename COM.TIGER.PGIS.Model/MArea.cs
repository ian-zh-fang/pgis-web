using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Area", ModelName = "Areas")]
    [System.Runtime.Serialization.DataContract(Name = "area", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MArea
    {
        private int? _pid = 0;//上级辖区标识
        private decimal _range = 0.0m;//辖区面积
        private int _companyTypeCode = 0;//数据归属单位类别代码
        private List<MArea> _childs = null;//区内辖区信息
        private bool _leaf = false;

        /// <summary>
        /// 辖区标识
        /// </summary>

        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 上级辖区标识
        /// </summary>

        [System.Runtime.Serialization.DataMember(Name = "PID")]
        public int? PID
        {
            get { return _pid; }
            set { _pid = value; }
        }

        /// <summary>
        /// 辖区名称
        /// </summary>

        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

        /// <summary>
        /// 新代码
        /// </summary>

        [System.Runtime.Serialization.DataMember(Name = "NewCode")]
        public string NewCode { get; set; }

        /// <summary>
        /// 旧代码
        /// </summary>

        [System.Runtime.Serialization.DataMember(Name = "OldCode")]
        public string OldCode { get; set; }

        /// <summary>
        /// 数据归属单位类型代码
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "BelongToID")]
        public int BelongToID
        {
            get { return _companyTypeCode; }
            set { _companyTypeCode = value; }
        }

        /// <summary>
        /// 数据归属单位类型
        /// </summary>

        [System.Runtime.Serialization.DataMember(Name = "CompanyType")]
        public MBelongTo CompanyType { get; set; }

        /// <summary>
        /// 归属地名称
        /// </summary>

        [System.Runtime.Serialization.DataMember(Name = "BelongToName")]
        public string BelongToName
        {
            get { return CompanyType == null ? null : CompanyType.Name; }
        }

        [System.Runtime.Serialization.DataMember(Name = "Description")]
        public string Description { get; set; }

        /// <summary>
        /// 当前区域范围信息
        /// </summary>

        [System.Runtime.Serialization.DataMember(Name = "Ranges")]
        public MAreaRange[] Ranges { get; set; } 

        /// <summary>
        /// 区内辖区
        /// </summary>

        [System.Runtime.Serialization.DataMember(Name = "ChildAreas")]
        public MArea[] ChildAreas
        {
            get
            {
                _childs = _childs ?? new List<MArea>();
                var arr = new MArea[_childs.Count];
                _childs.CopyTo(arr);
                return arr;
            }
            set {
                _childs = _childs ?? new List<MArea>();
                _childs.AddRange(value);
                _leaf = _childs.Count == 0;
            }
        }

        [System.Runtime.Serialization.DataMember(Name="text")]
        public string Text { get { return Name; } }

        [System.Runtime.Serialization.DataMember(Name="children")]
        public MArea[] Child { get { return ChildAreas; } }

        [System.Runtime.Serialization.DataMember(Name="leaf")]
        public bool Leaf 
        {
            get { return _leaf; }
        }

        [System.Runtime.Serialization.DataMember(Name="expend")]
        public bool Expend { get { return true; } }
    }
}
