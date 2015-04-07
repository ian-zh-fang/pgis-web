using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Menu", ModelName = "Menus")]
    [System.Runtime.Serialization.DataContract(Name="Menu", Namespace="http://www.tiger.com/pgis/model/")]
    public class MMenu:IComparable<MMenu>
    {
        private int _menu_id;

        [System.Runtime.Serialization.DataMember(Name = "Id")]
        public int Id
        {
            get { return _menu_id; }
            set { _menu_id = value; }
        }
        private int _menu_pid;

        [System.Runtime.Serialization.DataMember(Name = "PId")]
        public int PId
        {
            get { return _menu_pid; }
            set { _menu_pid = value; }
        }
        private string _menu_text;

        [System.Runtime.Serialization.DataMember(Name = "Text")]
        public string Text
        {
            get { return _menu_text; }
            set { _menu_text = value; }
        }
        private string _menu_key;

        [System.Runtime.Serialization.DataMember(Name = "Code")]
        public string Code
        {
            get { return _menu_key; }
            set { _menu_key = value; }
        }
        private int _menu_disabled;

        [System.Runtime.Serialization.DataMember(Name = "Disabled")]
        public int Disabled
        {
            get { return _menu_disabled; }
            set { _menu_disabled = value; }
        }
        private int _menu_checked;

        [System.Runtime.Serialization.DataMember(Name = "Checked")]
        public int Checked
        {
            get { return _menu_checked; }
            set { _menu_checked = value; }
        }
        private string _menu_iconcls;

        [System.Runtime.Serialization.DataMember(Name = "Iconcls")]
        public string Iconcls
        {
            get { return _menu_iconcls; }
            set { _menu_iconcls = value; }
        }
        private string _menu_hander;

        [System.Runtime.Serialization.DataMember(Name = "Handler")]
        public string Handler
        {
            get { return _menu_hander; }
            set { _menu_hander = value; }
        }
        private string _menu_description;

        [System.Runtime.Serialization.DataMember(Name = "Description")]
        public string Description
        {
            get { return _menu_description; }
            set { _menu_description = value; }
        }
        private int _menu_sort;

        [System.Runtime.Serialization.DataMember(Name = "Sort")]
        public int Sort
        {
            get { return _menu_sort; }
            set { _menu_sort = value; }
        }


        [System.Runtime.Serialization.DataMember(Name = "ChildMenus")]
        public MMenu[] ChildMenus { get; set; }

        public T Cast<T>() where T : MMenu, new()
        {
            if (ChildMenus != null && ChildMenus.Length > 0)
            {
                for (var i = 0; i < ChildMenus.Length; i++)
                {
                    ChildMenus[i] = ChildMenus[i].Cast<T>();
                }
            }

            var t = new T();
            t.Checked = this.Checked;
            t.ChildMenus = this.ChildMenus;
            t.Code = this.Code;
            t.Description = this.Description;
            t.Disabled = this.Disabled;
            t.Handler = this.Handler;
            t.Iconcls = this.Iconcls;
            t.Id = this.Id;
            t.PId = this.PId;
            t.Sort = this.Sort;
            t.Text = this.Text;
            return t;
        }

        public MMenuEx Cast()
        {
            return Cast<MMenuEx>();
        }

        public static List<MMenu> Cast<T>(List<MMenu> items) where T : MMenu, new()
        {
            if (items == null) return new List<MMenu>();
            for (var i = 0; i < items.Count; i++)
                items[i] = items[i].Cast<T>();
            return items;
        }

        public static List<MMenu> Cast(List<MMenu> items)
        {
            return Cast<MMenuEx>(items);
        }

        public int CompareTo(MMenu other)
        {
            if (this.Sort > other.Sort) return -1;
            if (this.Sort < other.Sort) return 1;
            return 0;
        }
    }


    [System.Runtime.Serialization.DataContract(Name = "MenuEx", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MMenuEx : MMenu
    {

        [System.Runtime.Serialization.DataMember(Name = "text")]
        public string text { get { return this.Text; } }

        [System.Runtime.Serialization.DataMember(Name = "expanded")]
        //展开节点
        public bool expanded
        {
            get { return true; }
        }

        [System.Runtime.Serialization.DataMember(Name = "leaf")]
        //叶节点标识
        public bool leaf
        {
            get
            {
                this.ChildMenus = this.ChildMenus ?? new MMenu[0];
                return this.ChildMenus.Length == 0;
            }
        }

        [System.Runtime.Serialization.DataMember(Name = "children")]
        //子节点
        public MMenu[] children
        {
            get { return this.ChildMenus; }
        }

        [System.Runtime.Serialization.DataMember(Name = "checked")]
        //复选框显示/隐藏
        public bool check
        {
            get { return false; }
        }

        //节点图标样式
        [System.Runtime.Serialization.DataMember(Name = "iconCls")]
        public string iconCls
        {
            get { return "bmenu"; }
        }
    }
}
