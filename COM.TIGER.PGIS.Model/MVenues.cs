
/*****************************************************
*   Author: Ian.Fun
*   File: Venues.cs
*   Version: 1.0.0.0
*   Description: 
*   Date: 2014-08-27 10:50
******************************************************
*/

using System;

namespace COM.TIGER.PGIS.Model
{
    ///<summary>
    /// 
    ///</summary>
    [Common.Attr.RemoteController(ControllerName = "Venues", ModelName = "Venuess")]
    [System.Runtime.Serialization.DataContract(Name = "Venues", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MVenues :MBase
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
        private int _TypeID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "TypeID")]
        public int TypeID
        {
            get{ return _TypeID;}
            set{ _TypeID = value;}
        }
        private string _TypeName;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "TypeName")]
        public string TypeName
        {
            get{ return _TypeName;}
            set{ _TypeName = value;}
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
        private int _AddressID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "AddressID")]
        public int AddressID
        {
            get{ return _AddressID;}
            set{ _AddressID = value;}
        }
        private string _Corporation;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Corporation")]
        public string Corporation
        {
            get{ return _Corporation;}
            set{ _Corporation = value;}
        }
        private string _Official;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Official")]
        public string Official
        {
            get{ return _Official;}
            set{ _Official = value;}
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
        private string _LicenceNum;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "LicenceNum")]
        public string LicenceNum
        {
            get{ return _LicenceNum;}
            set{ _LicenceNum = value;}
        }
        private DateTime _LicenceStartTime;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "LicenceStartTime")]
        public DateTime LicenceStartTime
        {
            get{ return _LicenceStartTime;}
            set{ _LicenceStartTime = value;}
        }
        private DateTime _LicenceEndTime;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "LicenceEndTime")]
        public DateTime LicenceEndTime
        {
            get{ return _LicenceEndTime;}
            set{ _LicenceEndTime = value;}
        }
    }
}

