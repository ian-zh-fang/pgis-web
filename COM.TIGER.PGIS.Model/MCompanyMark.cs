using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "CompanyMark", ModelName = "CompanyMarks")]
    [System.Runtime.Serialization.DataContract(Name = "companymark", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MCompanyMark:MBase, IComparable<MCompanyMark>
    {
        private float _x = 0.0f;
        private float _y = 0.0f;

        /// <summary>
        /// 标识符
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 标注坐标的横坐标
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "X")]
        public float X { get { return _x; } set { _x = value; } }

        /// <summary>
        /// 标注坐标的纵坐标
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Y")]
        public float Y { get { return _y; } set { _y = value; } }

        /// <summary>
        /// 标注单位的名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

        /// <summary>
        /// 标注单位的电话
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Telephone")]
        public string Telephone { get; set; }

        /// <summary>
        /// 标注单位备注信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Description")]
        public string Description { get; set; }

        /// <summary>
        /// 标注类型
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Type")]
        public int Type { get; set; }

        public int CompareTo(MCompanyMark other)
        {
            if (ID > other.ID) return 1;
            if (ID < other.ID) return -1;
            return 0;
        }
    }
}
