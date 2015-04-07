
/*****************************************************
*   Author: Ian.Fun
*   File: PopulationBasicInfo.cs
*   Version: 1.0.0.0
*   Description: 
*   Date: 2014-08-27 10:46
******************************************************
*/

using System;

namespace COM.TIGER.PGIS.Model
{
    ///<summary>
    /// 
    ///</summary>
    [Common.Attr.RemoteController(ControllerName = "PopulationBasicInfo", ModelName = "PopulationBasicInfos")]
    [System.Runtime.Serialization.DataContract(Name = "PopulationBasicInfo", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MPopulationBasicInfo :MBase
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
        private string _OtherName;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "OtherName")]
        public string OtherName
        {
            get{ return _OtherName;}
            set{ _OtherName = value;}
        }
        private int _SexID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "SexID")]
        public int SexID
        {
            get{ return _SexID;}
            set{ _SexID = value;}
        }
        private string _Sex;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Sex")]
        public string Sex
        {
            get{ return _Sex;}
            set{ _Sex = value;}
        }
        private int _LiveTypeID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "LiveTypeID")]
        public int LiveTypeID
        {
            get{ return _LiveTypeID;}
            set{ _LiveTypeID = value;}
        }
        private string _LiveType;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "LiveType")]
        public string LiveType
        {
            get{ return _LiveType;}
            set{ _LiveType = value;}
        }
        private string _Nation;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Nation")]
        public string Nation
        {
            get{ return _Nation;}
            set{ _Nation = value;}
        }
        private int _EducationID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "EducationID")]
        public int EducationID
        {
            get{ return _EducationID;}
            set{ _EducationID = value;}
        }
        private string _Education;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Education")]
        public string Education
        {
            get{ return _Education;}
            set{ _Education = value;}
        }
        private int _OriginProvinceID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "OriginProvinceID")]
        public int OriginProvinceID
        {
            get{ return _OriginProvinceID;}
            set{ _OriginProvinceID = value;}
        }
        private string _OriginProvince;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "OriginProvince")]
        public string OriginProvince
        {
            get{ return _OriginProvince;}
            set{ _OriginProvince = value;}
        }
        private int _OriginCityID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "OriginCityID")]
        public int OriginCityID
        {
            get{ return _OriginCityID;}
            set{ _OriginCityID = value;}
        }
        private string _OriginCity;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "OriginCity")]
        public string OriginCity
        {
            get{ return _OriginCity;}
            set{ _OriginCity = value;}
        }
        private string _Stature;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Stature")]
        public string Stature
        {
            get{ return _Stature;}
            set{ _Stature = value;}
        }
        private string _PoliticalStatus;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "PoliticalStatus")]
        public string PoliticalStatus
        {
            get{ return _PoliticalStatus;}
            set{ _PoliticalStatus = value;}
        }

        private int _PoliticalStatusID;
        /// <summary>
        /// 政治面貌ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "PoliticalStatusID")]
        public int PoliticalStatusID
        {
            get { return _PoliticalStatusID; }
            set { _PoliticalStatusID = value; }
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
        private int _BloodTypeID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "BloodTypeID")]
        public int BloodTypeID
        {
            get{ return _BloodTypeID;}
            set{ _BloodTypeID = value;}
        }
        private string _BloodType;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "BloodType")]
        public string BloodType
        {
            get{ return _BloodType;}
            set{ _BloodType = value;}
        }
        private int _SoldierStatusID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "SoldierStatusID")]
        public int SoldierStatusID
        {
            get{ return _SoldierStatusID;}
            set{ _SoldierStatusID = value;}
        }
        private string _SoldierStatus;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "SoldierStatus")]
        public string SoldierStatus
        {
            get{ return _SoldierStatus;}
            set{ _SoldierStatus = value;}
        }
        private int _MarriageStatusID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MarriageStatusID")]
        public int MarriageStatusID
        {
            get{ return _MarriageStatusID;}
            set{ _MarriageStatusID = value;}
        }
        private string _MarriageStatus;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MarriageStatus")]
        public string MarriageStatus
        {
            get{ return _MarriageStatus;}
            set{ _MarriageStatus = value;}
        }
        private string _Religion;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Religion")]
        public string Religion
        {
            get{ return _Religion;}
            set{ _Religion = value;}
        }
        private string _LivePhone;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "LivePhone")]
        public string LivePhone
        {
            get{ return _LivePhone;}
            set{ _LivePhone = value;}
        }
        private string _Telephone1;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Telephone1")]
        public string Telephone1
        {
            get{ return _Telephone1;}
            set{ _Telephone1 = value;}
        }
        private string _Domicile;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Domicile")]
        public string Domicile
        {
            get{ return _Domicile;}
            set{ _Domicile = value;}
        }
        private int _IsPsychosis;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "IsPsychosis")]
        public int IsPsychosis
        {
            get{ return _IsPsychosis;}
            set{ _IsPsychosis = value;}
        }
        private int _PsychosisTypeID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "PsychosisTypeID")]
        public int PsychosisTypeID
        {
            get{ return _PsychosisTypeID;}
            set{ _PsychosisTypeID = value;}
        }
        private string _PsychosisType;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "PsychosisType")]
        public string PsychosisType
        {
            get{ return _PsychosisType;}
            set{ _PsychosisType = value;}
        }
        private string _HouseholdNo;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "HouseholdNo")]
        public string HouseholdNo
        {
            get{ return _HouseholdNo;}
            set{ _HouseholdNo = value;}
        }
        private int _HRelationID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "HRelationID")]
        public int HRelationID
        {
            get{ return _HRelationID;}
            set{ _HRelationID = value;}
        }
        private string _HRelation;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "HRelation")]
        public string HRelation
        {
            get{ return _HRelation;}
            set{ _HRelation = value;}
        }
        private string _PhotoPath;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "PhotoPath")]
        public string PhotoPath
        {
            get{ return _PhotoPath;}
            set{ _PhotoPath = value;}
        }
        private int _HomeAddrID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "HomeAddrID")]
        public int HomeAddrID
        {
            get{ return _HomeAddrID;}
            set{ _HomeAddrID = value;}
        }
        private int _CurrentAddrID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "CurrentAddrID")]
        public int CurrentAddrID
        {
            get{ return _CurrentAddrID;}
            set{ _CurrentAddrID = value;}
        }



        /***************************************************************
        *   populationbasicinfo extention
        **************************************************************** 
        */

        /// <summary>
        /// 血型
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "BloodTypeParam")]
        public MParam BloodTypeParam { get; set; }

        /// <summary>
        /// 兵役情况
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Escuage")]
        public MParam Escuage { get; set; }

        /// <summary>
        /// 与户主关系
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "HouseolderRelationShip")]
        public MParam HouseolderRelationShip { get; set; }

        /// <summary>
        /// 性别
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Gender")]
        public MParam Gender { get; set; }

        /// <summary>
        /// 教育程度
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "EducationParam")]
        public MParam EducationParam { get; set; }

        /// <summary>
        /// 籍贯省
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Province")]
        public MParam Province { get; set; }

        /// <summary>
        /// 籍贯市
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "City")]
        public MParam City { get; set; }

        /// <summary>
        /// 政治面貌
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "PoliticalStatusParam")]
        public MParam PoliticalStatusParam { get; set; }

        /// <summary>
        /// 婚姻状况
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Marriage")]
        public MParam Marriage { get; set; }

        /// <summary>
        /// 重点人口类别
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Importmentype")]
        public MParam Importmentype { get; set; }

        /// <summary>
        /// 家庭住址
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "HomeAddr")]
        public MAddress HomeAddr { get; set; }

        /// <summary>
        /// 当前住址
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "CurrentAddr")]
        public MAddress CurrentAddr { get; set; }
    }

    [Common.Attr.RemoteController(ControllerName = "PopulationBasicInfo", ModelName = "PopulationBasicInfos")]
    [System.Runtime.Serialization.DataContract(Name = "PopulationBasicInfoEx", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MPopulationBasicInfoEx : MPopulationBasicInfo
    {
        private string _HomeAddress;
        [System.Runtime.Serialization.DataMember(Name = "HomeAddress")]
        public string HomeAddress
        {
            get { return _HomeAddress; }
            set { _HomeAddress = value; }
        }

        private string _CurrentAddress;
        [System.Runtime.Serialization.DataMember(Name = "CurrentAddress")]
        public string CurrentAddress
        {
            get { return _CurrentAddress; }
            set { _CurrentAddress = value; }
        }
    }
}

