
/*****************************************************
*   Author: Ian.Fun
*   File: Administrative.cs
*   Version: 1.0.0.0
*   Description: 
*   Date: 2014-08-27 10:39
******************************************************
*/

using System;

namespace COM.TIGER.PGIS.Model
{
    ///<summary>
    /// 
    ///</summary>
    [Common.Attr.RemoteController(ControllerName = "Administrative", ModelName = "Administratives")]
    [System.Runtime.Serialization.DataContract(Name = "Administrative", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MAdministrative : MBase
    {
        private int _ID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID
        {
            get { return _ID; }
            set { _ID = value; }
        }
        private string _Name;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name
        {
            get { return _Name; }
            set { _Name = value; }
        }
        private string _Code;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Code")]
        public string Code
        {
            get { return _Code; }
            set { _Code = value; }
        }
        private int? _PID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "PID")]
        public int? PID
        {
            get { return _PID; }
            set { _PID = value; }
        }
        private string _FirstLetter;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "FirstLetter")]
        public string FirstLetter
        {
            get { return _FirstLetter; }
            set { _FirstLetter = value; }
        }
        private int _AreaID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "AreaID")]
        public int AreaID
        {
            get { return _AreaID; }
            set { _AreaID = value; }
        }
        private string _AreaName;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "AreaName")]
        public string AreaName
        {
            get { return _AreaName; }
            set { _AreaName = value; }
        }


        /// <summary>
        /// 上一级行政区划
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Parent")]
        public Model.MAdministrative Parent { get; set; }

        /// <summary>
        /// 当前新政区划隶属辖区信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Area")]
        public Model.MArea Area { get; set; }

        /// <summary>
        /// 行政区划全称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "FullName")]
        public string FullName
        {
            get
            {
                if (Parent == null) return Name;
                return string.Format("{0},{1}", Parent.FullName, Name);
            }
        }
        /// <summary>
        /// 下一级行政区划信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Items")]
        public Model.MAdministrative[] Items { get; set; }

        /// <summary>
        /// 当前行政区划中的街巷信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Streets")]
        public Model.MStreet[] Streets { get; set; }

        //tree properties

        [System.Runtime.Serialization.DataMember(Name = "text")]
        public string Text { get { return Name; } }

        [System.Runtime.Serialization.DataMember(Name = "children")]
        public Model.MAdministrative[] Child { get { return Items ?? new Model.MAdministrative[0]; } }

        [System.Runtime.Serialization.DataMember(Name = "leaf")]
        public bool Leaf
        {
            get { return Child.Length == 0; }
        }

        [System.Runtime.Serialization.DataMember(Name = "expend")]
        public bool Expend { get { return true; } }
    }
}

