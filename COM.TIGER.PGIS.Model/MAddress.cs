
/*****************************************************
*   Author: Ian.Fun
*   File: Address.cs
*   Version: 1.0.0.0
*   Description: 
*   Date: 2014-08-27 10:37
******************************************************
*/

using System;

namespace COM.TIGER.PGIS.Model
{
    ///<summary>
    /// 
    ///</summary>
    [Common.Attr.RemoteController(ControllerName = "Address", ModelName = "Addresses")]
    [System.Runtime.Serialization.DataContract(Name = "Address", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MAddress
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
        private string _Content;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Content")]
        public string Content
        {
            get { return _Content; }
            set { _Content = value; }
        }
        private int _AdminID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "AdminID")]
        public int AdminID
        {
            get { return _AdminID; }
            set { _AdminID = value; }
        }
        private int _OwnerInfoID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "OwnerInfoID")]
        public int OwnerInfoID
        {
            get { return _OwnerInfoID; }
            set { _OwnerInfoID = value; }
        }
        private int _StreetID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "StreetID")]
        public int StreetID
        {
            get { return _StreetID; }
            set { _StreetID = value; }
        }
        private int _NumID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "NumID")]
        public int NumID
        {
            get { return _NumID; }
            set { _NumID = value; }
        }
        private int _UnitID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "UnitID")]
        public int UnitID
        {
            get { return _UnitID; }
            set { _UnitID = value; }
        }
        private int _RoomID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "RoomID")]
        public int RoomID
        {
            get { return _RoomID; }
            set { _RoomID = value; }
        }

        /// <summary>
        /// 新政区划
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Administrative")]
        public MAdministrative Administrative { get; set; }

        /// <summary>
        /// 楼房
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "OwnerInfo")]
        public MOwnerInfoEx OwnerInfo { get; set; }

        /// <summary>
        /// 街道
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Street")]
        public MStreet Street { get; set; }

        /// <summary>
        /// 门牌号
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "StreetNum")]
        public MStreetNum StreetNum { get; set; }

        /// <summary>
        /// 楼房单元
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Unit")]
        public MUnit Unit { get; set; }

        /// <summary>
        /// 房间
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Room")]
        public MRooms Room { get; set; }
    }
}

