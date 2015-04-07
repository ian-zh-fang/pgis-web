
/*****************************************************
*   Author: Ian.Fun
*   File: HotelStay.cs
*   Version: 1.0.0.0
*   Description: 
*   Date: 2014-08-27 10:42
******************************************************
*/

using System;

namespace COM.TIGER.PGIS.Model
{
    ///<summary>
    /// 
    ///</summary>
    [Common.Attr.RemoteController(ControllerName = "HotelStay", ModelName = "HotelStays")]
    [System.Runtime.Serialization.DataContract(Name = "HotelStay", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MHotelStay :MBase
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
        private string _Nationality;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Nationality")]
        public string Nationality
        {
            get{ return _Nationality;}
            set{ _Nationality = value;}
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
        private string _FirstName;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "FirstName")]
        public string FirstName
        {
            get{ return _FirstName;}
            set{ _FirstName = value;}
        }
        private string _LastName;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "LastName")]
        public string LastName
        {
            get{ return _LastName;}
            set{ _LastName = value;}
        }
        private int _Gender;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Gender")]
        public int Gender
        {
            get{ return _Gender;}
            set{ _Gender = value;}
        }
        private string _GenderDesc;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "GenderDesc")]
        public string GenderDesc
        {
            get{ return _GenderDesc;}
            set{ _GenderDesc = value;}
        }
        private int _CredentialsID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "CredentialsID")]
        public int CredentialsID
        {
            get{ return _CredentialsID;}
            set{ _CredentialsID = value;}
        }
        private string _Credentials;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Credentials")]
        public string Credentials
        {
            get{ return _Credentials;}
            set{ _Credentials = value;}
        }
        private string _CredentialsNum;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "CredentialsNum")]
        public string CredentialsNum
        {
            get{ return _CredentialsNum;}
            set{ _CredentialsNum = value;}
        }
        private string _PutinTime;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "PutinTime")]
        public string PutinTime
        {
            get{ return _PutinTime;}
            set{ _PutinTime = value;}
        }
        private string _GetoutTime;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "GetoutTime")]
        public string GetoutTime
        {
            get{ return _GetoutTime;}
            set{ _GetoutTime = value;}
        }
        private string _PutinRoomNum;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "PutinRoomNum")]
        public string PutinRoomNum
        {
            get{ return _PutinRoomNum;}
            set{ _PutinRoomNum = value;}
        }
        private int _HotelID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "HotelID")]
        public int HotelID
        {
            get{ return _HotelID;}
            set{ _HotelID = value;}
        }
        private string _HotelName;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "HotelName")]
        public string HotelName
        {
            get{ return _HotelName;}
            set{ _HotelName = value;}
        }

        /// <summary>
        /// ¬√µÍ–≈œ¢
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Hotel")]
        public Model.MHotel Hotel { get; set; }
    }
}

