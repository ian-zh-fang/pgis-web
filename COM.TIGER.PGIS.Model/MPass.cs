
/*****************************************************
*   Author: Ian.Fun
*   File: Pass.cs
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
    [Common.Attr.RemoteController(ControllerName = "Pass", ModelName = "Passs")]
    [System.Runtime.Serialization.DataContract(Name = "Pass", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MPass :MBase
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
        private double _X;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "X")]
        public double X
        {
            get{ return _X;}
            set{ _X = value;}
        }
        private double _Y;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Y")]
        public double Y
        {
            get{ return _Y;}
            set{ _Y = value;}
        }
    }
}

