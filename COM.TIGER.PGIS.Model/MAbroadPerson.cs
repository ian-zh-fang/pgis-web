
/*****************************************************
*   Author: Ian.Fun
*   File: AbroadPerson.cs
*   Version: 1.0.0.0
*   Description: 
*   Date: 2014-08-27 10:36
******************************************************
*/

using System;

namespace COM.TIGER.PGIS.Model
{
    ///<summary>
    /// 
    ///</summary>
    [Common.Attr.RemoteController(ControllerName = "AbroadPerson", ModelName = "AbroadPersons")]
    [System.Runtime.Serialization.DataContract(Name = "AbroadPerson", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MAbroadPerson
    {
        private int _AP_ID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "AP_ID")]
        public int AP_ID
        {
            get{ return _AP_ID;}
            set{ _AP_ID = value;}
        }
        private int _PoID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "PoID")]
        public int PoID
        {
            get{ return _PoID;}
            set{ _PoID = value;}
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
        private int _CountryID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "CountryID")]
        public int CountryID
        {
            get{ return _CountryID;}
            set{ _CountryID = value;}
        }
        private string _Country;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Country")]
        public string Country
        {
            get{ return _Country;}
            set{ _Country = value;}
        }
        private int _CardTypeID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "CardTypeID")]
        public int CardTypeID
        {
            get{ return _CardTypeID;}
            set{ _CardTypeID = value;}
        }
        private string _CardTypeName;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "CardTypeName")]
        public string CardTypeName
        {
            get{ return _CardTypeName;}
            set{ _CardTypeName = value;}
        }
        private string _CardNo;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "CardNo")]
        public string CardNo
        {
            get{ return _CardNo;}
            set{ _CardNo = value;}
        }
        private DateTime _ValidityDate;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "ValidityDate")]
        public DateTime ValidityDate
        {
            get{ return _ValidityDate;}
            set{ _ValidityDate = value;}
        }
        private int _VisaTypeID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "VisaTypeID")]
        public int VisaTypeID
        {
            get{ return _VisaTypeID;}
            set{ _VisaTypeID = value;}
        }
        private string _VisaTypeName;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "VisaTypeName")]
        public string VisaTypeName
        {
            get{ return _VisaTypeName;}
            set{ _VisaTypeName = value;}
        }
        private string _VisaNoAndValidity;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "VisaNoAndValidity")]
        public string VisaNoAndValidity
        {
            get{ return _VisaNoAndValidity;}
            set{ _VisaNoAndValidity = value;}
        }
        private DateTime _StayValidityDate;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "StayValidityDate")]
        public DateTime StayValidityDate
        {
            get{ return _StayValidityDate;}
            set{ _StayValidityDate = value;}
        }
        private string _EntryPort;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "EntryPort")]
        public string EntryPort
        {
            get{ return _EntryPort;}
            set{ _EntryPort = value;}
        }
        private DateTime _EntryDate;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "EntryDate")]
        public DateTime EntryDate
        {
            get{ return _EntryDate;}
            set{ _EntryDate = value;}
        }
        private DateTime _ArrivalDate;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "ArrivalDate")]
        public DateTime ArrivalDate
        {
            get{ return _ArrivalDate;}
            set{ _ArrivalDate = value;}
        }
        private DateTime _LiveDate;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "LiveDate")]
        public DateTime LiveDate
        {
            get{ return _LiveDate;}
            set{ _LiveDate = value;}
        }
        private DateTime _LeaveDate;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "LeaveDate")]
        public DateTime LeaveDate
        {
            get{ return _LeaveDate;}
            set{ _LeaveDate = value;}
        }
        private string _StayReason;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "StayReason")]
        public string StayReason
        {
            get{ return _StayReason;}
            set{ _StayReason = value;}
        }
        private string _ReceivePerson;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "ReceivePerson")]
        public string ReceivePerson
        {
            get{ return _ReceivePerson;}
            set{ _ReceivePerson = value;}
        }
        private string _Phone;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Phone")]
        public string Phone
        {
            get{ return _Phone;}
            set{ _Phone = value;}
        }
    }
}

