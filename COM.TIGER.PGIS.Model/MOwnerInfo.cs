using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "OwnerInfo", ModelName = "OwnerInfos")]
    [System.Runtime.Serialization.DataContract(Name = "ownerInfo", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MOwnerInfo : MBase, IComparable<MOwnerInfo>
    {
        [System.Runtime.Serialization.DataMember(Name = "MOI_ID")]
        public int MOI_ID { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "MOI_MOA_ID")]
        public int MOI_MOA_ID { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "MOI_MEH_ID")]
        public int MOI_MEH_ID { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "MOI_LabelName")]
        public string MOI_LabelName { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "MOI_OwnerName")]
        public string MOI_OwnerName { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "PY")]
        public string PY { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "MOI_OwnerAddress")]
        public string MOI_OwnerAddress { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "MOI_OwnerTel")]
        public string MOI_OwnerTel { get; set; }

        [System.Runtime.Serialization.DataMember(Name = "MOI_OwnerDes")]
        public string MOI_OwnerDes { get; set; }

        //[System.Runtime.Serialization.DataMember(Name = "MOI_Flag")]
        //public short MOI_Flag { get; set; }

        //[System.Runtime.Serialization.DataMember(Name = "MOI_sFlag")]
        //public string MOI_sFlag { get; set; }

        //[System.Runtime.Serialization.DataMember(Name = "MOI_CreateDate")]
        //public DateTime MOI_CreateDate { get; set; }

        //[System.Runtime.Serialization.DataMember(Name = "MOI_UpdateDate")]
        //public DateTime MOI_UpdateDate { get; set; }

        //[System.Runtime.Serialization.DataMember(Name = "MOI_IsActive")]
        //public short MOI_IsActive { get; set; }

        //[System.Runtime.Serialization.DataMember(Name = "JID")]
        //public string JID { get; set; }

        //[System.Runtime.Serialization.DataMember(Name = "REQU")]
        //public string REQU { get; set; }

        public int CompareTo(MOwnerInfo other)
        {
            if (MOI_ID > other.MOI_ID) return 1;
            if (MOI_ID < other.MOI_ID) return -1;
            return 0;
        }
    }

    [Common.Attr.RemoteController(ControllerName = "Building", ModelName = "Buildings")]
    [System.Runtime.Serialization.DataContract(Name = "MOwnerInfoEx", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MOwnerInfoEx : MOwnerInfo 
    {

        /******************************************************************
        * Pgis_Building
        ******************************************************************/

        private int _Building_ID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Building_ID")]
        public int Building_ID
        {
            get { return _Building_ID; }
            set { _Building_ID = value; }
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
        private int _FloorsCount;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "FloorsCount")]
        public int FloorsCount
        {
            get { return _FloorsCount; }
            set { _FloorsCount = value; }
        }
        private int _RoomsCount;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "RoomsCount")]
        public int RoomsCount
        {
            get { return _RoomsCount; }
            set { _RoomsCount = value; }
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
        private string _AdminName;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "AdminName")]
        public string AdminName
        {
            get { return _AdminName; }
            set { _AdminName = value; }
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
        private int _StreetNum;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "StreetNum")]
        public int StreetNum
        {
            get { return _StreetNum; }
            set { _StreetNum = value; }
        }
        private string _Address;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Address")]
        public string Address
        {
            get {
                var strbuild = new System.Text.StringBuilder();
                if (string.IsNullOrWhiteSpace(_StreetName))
                    return string.Empty;
                strbuild.Append(_StreetName);
                if (!string.IsNullOrWhiteSpace(_StreetNumber))
                    strbuild.Append(string.Format(",{0}", _StreetNumber));

                return _Address = strbuild.ToString();
            }
            set { _Address = value; }
        }
        private int _RoomStructureID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "RoomStructureID")]
        public int RoomStructureID
        {
            get { return _RoomStructureID; }
            set { _RoomStructureID = value; }
        }
        private string _RoomStructure;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "RoomStructure")]
        public string RoomStructure
        {
            get { return _RoomStructure; }
            set { _RoomStructure = value; }
        }

        private string _StreetName;
        [System.Runtime.Serialization.DataMember(Name = "StreetName")]
        public string StreetName
        {
            get { return _StreetName; }
            set { _StreetName = value; }
        }

        private string _StreetNumber;
        [System.Runtime.Serialization.DataMember(Name = "StreetNumber")]
        public string StreetNumber
        {
            get { return _StreetNumber; }
            set { _StreetNumber = value; }
        }


        /******************************************************************
        * Map_ElementHot
        ******************************************************************/

        private int _MEH_ID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_ID")]
        public int MEH_ID
        {
            get { return _MEH_ID; }
            set { _MEH_ID = value; }
        }
        private int _MEH_PID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_PID")]
        public int MEH_PID
        {
            get { return _MEH_PID; }
            set { _MEH_PID = value; }
        }
        private int _MEH_MOI_ID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_MOI_ID")]
        public int MEH_MOI_ID
        {
            get { return _MEH_MOI_ID; }
            set { _MEH_MOI_ID = value; }
        }
        private string _MEH_CenterX;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_CenterX")]
        public string MEH_CenterX
        {
            get { return _MEH_CenterX; }
            set { _MEH_CenterX = value; }
        }
        private string _MEH_CenterY;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_CenterY")]
        public string MEH_CenterY
        {
            get { return _MEH_CenterY; }
            set { _MEH_CenterY = value; }
        }
        private string _MEH_Croods;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_Croods")]
        public string MEH_Croods
        {
            get { return _MEH_Croods; }
            set { 
                _MEH_Croods = value;
                float x = 0.00f;
                float y = 0.00f;
                GetCenterCoordinate(value, out x, out y);
                _MEH_CenterX = string.Format("{0}", x);
                _MEH_CenterY = string.Format("{0}", y);
            }
        }
        //private string _MEH_HotLevel = "0,1,";
        /////<summary>
        ///// 
        /////</summary>
        //[System.Runtime.Serialization.DataMember(Name = "MEH_HotLevel")]
        //public string MEH_HotLevel
        //{
        //    get { return _MEH_HotLevel; }
        //    set { _MEH_HotLevel = value; }
        //}
        //private short _MEH_IsLabel = 1;
        /////<summary>
        ///// 
        /////</summary>
        //[System.Runtime.Serialization.DataMember(Name = "MEH_IsLabel")]
        //public short MEH_IsLabel
        //{
        //    get { return _MEH_IsLabel; }
        //    set { _MEH_IsLabel = value; }
        //}
        //private short _MEH_HotFlag = 1;
        /////<summary>
        ///// 
        /////</summary>
        //[System.Runtime.Serialization.DataMember(Name = "MEH_HotFlag")]
        //public short MEH_HotFlag
        //{
        //    get { return _MEH_HotFlag; }
        //    set { _MEH_HotFlag = value; }
        //}
        //private DateTime _MEH_CreateDate;
        /////<summary>
        ///// 
        /////</summary>
        //[System.Runtime.Serialization.DataMember(Name = "MEH_CreateDate")]
        //public DateTime MEH_CreateDate
        //{
        //    get { return _MEH_CreateDate; }
        //    set { _MEH_CreateDate = value; }
        //}
        //private DateTime _MEH_UpdateDate;
        /////<summary>
        ///// 
        /////</summary>
        //[System.Runtime.Serialization.DataMember(Name = "MEH_UpdateDate")]
        //public DateTime MEH_UpdateDate
        //{
        //    get { return _MEH_UpdateDate; }
        //    set { _MEH_UpdateDate = value; }
        //}
        //private byte _MEH_IsLock;
        /////<summary>
        ///// 
        /////</summary>
        //[System.Runtime.Serialization.DataMember(Name = "MEH_IsLock")]
        //public byte MEH_IsLock
        //{
        //    get { return _MEH_IsLock; }
        //    set { _MEH_IsLock = value; }
        //}
        //private double _Area;
        /////<summary>
        ///// 
        /////</summary>
        //[System.Runtime.Serialization.DataMember(Name = "Area")]
        //public double Area
        //{
        //    get { return _Area; }
        //    set { _Area = value; }
        //}
        //private int _flag;
        /////<summary>
        ///// 
        /////</summary>
        //[System.Runtime.Serialization.DataMember(Name = "flag")]
        //public int flag
        //{
        //    get { return _flag; }
        //    set { _flag = value; }
        //}

        /******************************************************************
        * Map_OwnerPic
        ******************************************************************/
        private System.Collections.Generic.List<Model.MOwnerPic> _items = new System.Collections.Generic.List<MOwnerPic>();
        /// <summary>
        /// 大楼图片信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Pictures")]
        public Model.MOwnerPic[] Pictures
        {
            get
            {
                var arr = new Model.MOwnerPic[_items.Count];
                _items.CopyTo(arr);
                return arr;
            }
        }

        private System.Collections.Generic.List<Model.MUnit> _units = new System.Collections.Generic.List<MUnit>();
        /// <summary>
        /// 大楼单元信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Units")]
        public Model.MUnit[] Units
        {
            get { return _units.ToArray(); }
        }

        private System.Collections.Generic.List<Model.MRooms> _rooms = new System.Collections.Generic.List<MRooms>();
        /// <summary>
        /// 大楼房间信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Rooms")]
        public Model.MRooms[] Rooms
        {
            get
            {
                _units.ForEach(t => Add(t.Rooms));
                return _rooms.ToArray();
            }
        }

        /// <summary>
        /// 批量添加大楼的图片信息，如果含有不存在的图片
        /// </summary>
        /// <param name="pics"></param>
        public void Add(params Model.MOwnerPic[] pics)
        {
            var arr = pics.Where(t => _items.Exists(x => x.MOP_ID == t.MOP_ID) == false);
            _items.AddRange(arr);
        }

        /// <summary>
        /// 批量添加大楼的单元信息，如果含有不存在单元信息
        /// </summary>
        /// <param name="units"></param>
        public void Add(params Model.MUnit[] units)
        {
            _units.AddRange(units.Where(t => !_units.Exists(x => t.Unit_ID == x.Unit_ID)));
        }

        /// <summary>
        /// 批量添加大楼的房间信息
        /// </summary>
        /// <param name="buildings"></param>
        public void Add(params Model.MRooms[] rooms)
        {
            _rooms.AddRange(rooms.Where(t => !_rooms.Exists(x => t.Room_ID == x.Room_ID)));
        }
    }

    [System.Runtime.Serialization.DataContract(Name = "ElementHot", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MElementHot : MBase
    {
        private int _MEH_ID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_ID")]
        public int MEH_ID
        {
            get { return _MEH_ID; }
            set { _MEH_ID = value; }
        }
        private int _MEH_PID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_PID")]
        public int MEH_PID
        {
            get { return _MEH_PID; }
            set { _MEH_PID = value; }
        }
        private int _MEH_MOI_ID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_MOI_ID")]
        public int MEH_MOI_ID
        {
            get { return _MEH_MOI_ID; }
            set { _MEH_MOI_ID = value; }
        }
        private string _MEH_CenterX;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_CenterX")]
        public string MEH_CenterX
        {
            get { return _MEH_CenterX; }
            set { _MEH_CenterX = value; }
        }
        private string _MEH_CenterY;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_CenterY")]
        public string MEH_CenterY
        {
            get { return _MEH_CenterY; }
            set { _MEH_CenterY = value; }
        }
        private string _MEH_Croods;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_Croods")]
        public string MEH_Croods
        {
            get { return _MEH_Croods; }
            set { _MEH_Croods = value; }
        }
        private string _MEH_HotLevel = "0,1";
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_HotLevel")]
        public string MEH_HotLevel
        {
            get { return _MEH_HotLevel; }
            set { _MEH_HotLevel = value; }
        }
        private int _MEH_IsLabel = 1;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_IsLabel")]
        public int MEH_IsLabel
        {
            get { return _MEH_IsLabel; }
            set { _MEH_IsLabel = value; }
        }
        private int _MEH_HotFlag = 1;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_HotFlag")]
        public int MEH_HotFlag
        {
            get { return _MEH_HotFlag; }
            set { _MEH_HotFlag = value; }
        }
        private int _MEH_IsLock;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MEH_IsLock")]
        public int MEH_IsLock
        {
            get { return _MEH_IsLock; }
            set { _MEH_IsLock = value; }
        }
        private double _Area;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Area")]
        public double Area
        {
            get { return _Area; }
            set { _Area = value; }
        }
        private int _flag;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "flag")]
        public int flag
        {
            get { return _flag; }
            set { _flag = value; }
        }
    }
}
