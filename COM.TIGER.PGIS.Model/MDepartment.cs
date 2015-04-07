using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Department", ModelName = "Departments")]
    [System.Runtime.Serialization.DataContract(Name = "Department", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MDepartment
    {
        /// <summary>
        /// 主键标识
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 上一级部门机构标识
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "PID")]
        public int? PID { get; set; }

        /// <summary>
        /// 部门机构代码
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Code")]
        public string Code { get; set; }

        /// <summary>
        /// 部门机构名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

        /// <summary>
        /// 备注信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Remarks")]
        public string Remarks { get; set; }

        /// <summary>
        /// 下级部门信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ChildDepartments")]
        public MDepartment[] ChildDepartments { get; set; }

        //===========================================================
        //用于处理树

        [System.Runtime.Serialization.DataMember(Name = "text")]
        public string text { get { return this.Name; } }

        //展开节点
        //  需要自动展开，必须设置为true
        [System.Runtime.Serialization.DataMember(Name = "expanded")]
        public bool expanded
        {
            get { return true; }
        }

        //叶节点标识
        [System.Runtime.Serialization.DataMember(Name = "leaf")]
        public bool leaf
        {
            get 
            {
                if (this.ChildDepartments == null) return true;
                return this.ChildDepartments.Length == 0; 
            }
        }

        //子节点
        [System.Runtime.Serialization.DataMember(Name = "children")]
        public MDepartment[] children
        {
            get { return this.ChildDepartments; }
        }

        //节点图标样式
        [System.Runtime.Serialization.DataMember(Name = "iconCls")]
        public string iconCls
        {
            get { return "bgroup"; }
        }
    }
}
