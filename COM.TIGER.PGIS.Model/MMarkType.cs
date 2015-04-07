using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName="MarkType", ModelName="MarkTypes")]
    [System.Runtime.Serialization.DataContract(Name = "MarkType", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MMarkType
    {
        /// <summary>
        /// 类型标识
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 类型名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

        /// <summary>
        /// 图标
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "IconCls")]
        public string IconCls { get; set; }

        /// <summary>
        /// 颜色
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Color")]
        public string Color { get; set; }

        /// <summary>
        /// 类型
        /// <para>1：标识单点</para>
        /// <para>2：标识线条</para>
        /// <para>3：标识区域</para>
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Type")]
        public int Type { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Remark")]
        public string Remark { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "Sort")]
        public int Sort { get; set; }

        /// <summary>
        /// 当前类型下的所有标注信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Marks")]
        public Model.MMark[] Marks { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "children")]
        public Model.MMark[] Children
        {
            get { return Marks; }
        }

        /// <summary>
        /// 用于处理树形结构，标识是否是叶子节点
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "leaf")]
        public bool Leaf
        {
            get { return false; }
        }

        /// <summary>
        /// 用于处理树形结构，标识节点名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "text")]
        public string Text { get { return Name; } }

        [System.Runtime.Serialization.DataMember(Name = "expend")]
        public bool Expend { get { return true; } }

        //[System.Runtime.Serialization.DataMember(Name = "checked")]
        //public bool CheckBox { get { return false; } }
    }
}
