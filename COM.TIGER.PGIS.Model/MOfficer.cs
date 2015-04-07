
/*****************************************************
*   Author: Ian.Fun
*   File: Officer.cs
*   Version: 1.0.0.0
*   Description: 
*   Date: 2014-08-27 10:44
******************************************************
*/

using System;

namespace COM.TIGER.PGIS.Model
{
    ///<summary>
    /// 
    ///</summary>
    [Common.Attr.RemoteController(ControllerName = "Officer", ModelName = "Officers")]
    [System.Runtime.Serialization.DataContract(Name = "Officer", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MOfficer :MBase
    {
        private int _ID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID
        {
            get{ return _ID;}
            set{ _ID = value;}
        }
        private string _Num;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Num")]
        public string Num
        {
            get{ return _Num;}
            set{ _Num = value;}
        }
        private string _Name;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name
        {
            get{ return _Name;}
            set{ _Name = value;}
        }
        private string _IdentityID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "IdentityID")]
        public string IdentityID
        {
            get{ return _IdentityID;}
            set{ _IdentityID = value;}
        }
        private string _Tel;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Tel")]
        public string Tel
        {
            get{ return _Tel;}
            set{ _Tel = value;}
        }

        [System.Runtime.Serialization.DataMember(Name = "Gender")]
        public int Gender { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "DeptID")]
        public int DeptID { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "Department")]
        public Model.MDepartment Department { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "DeptName")]
        public string DeptName { get { return Department == null ? string.Empty : Department.Name; } }
    }
}

