using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    /// <summary>
    /// 角色信息
    /// </summary>
    [Common.Attr.RemoteController(ControllerName = "Role", ModelName = "Roles")]
    [System.Runtime.Serialization.DataContract(Name = "MRole", Namespace = "http://www.tigerhz.com/pgis/model/")]
    public class MRole
    {
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "Remarks")]
        public string Remarks { get; set; }

        public T Cast<T>() where T : MRole, new()
        {
            var t = new T();
            t.ID = this.ID;
            t.Name = this.Name;
            t.Remarks = this.Remarks;
            return t;
        }

        public MRoleEx Cast()
        {
            return Cast<MRoleEx>();
        }

        public static List<MRole> Cast<T>(List<MRole> items) where T : MRole, new()
        {
            if (items == null) return new List<MRole>();
            for (var i = 0; i < items.Count; i++)
                items[i] = items[i].Cast<T>();
            return items;
        }

        public static List<MRole> Cast(List<MRole> items)
        {
            return Cast<MRoleEx>(items);
        }
    }

    [System.Runtime.Serialization.DataContract(Name = "MRoleEx", Namespace = "http://www.tigerhz.com/pgis/model/")]
    public class MRoleEx : MRole
    {
        [System.Runtime.Serialization.DataMember(Name = "text")]
        public string Text {
            get { return Name; }
        }

        [System.Runtime.Serialization.DataMember(Name = "leaf")]
        public bool Leaf { 
            get { return true; } 
        }

        //[System.Runtime.Serialization.DataMember(Name = "expended")]
        //public bool Expend {
        //    get { return true; }
        //}

        [System.Runtime.Serialization.DataMember(Name = "checked")]
        public bool Checked { 
            get { return false; } 
        }

        //节点图标样式
        [System.Runtime.Serialization.DataMember(Name = "iconCls")]
        public string IconCls
        {
            get { return "buser"; }
        }
    }
}
