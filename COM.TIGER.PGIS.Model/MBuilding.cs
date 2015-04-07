using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Building", ModelName = "Buildings")]
    [System.Runtime.Serialization.DataContract(Name = "building", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MBuilding:MBase,IComparable<MBuilding>
    {
        /// <summary>
        /// 楼房子表标识符
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Building_ID")]
        public int Building_ID { get; set; }

        /// <summary>
        /// 楼房主表标识符
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "OwnerInfoID")]
        public int OwnerInfoID { get; set; }

        /// <summary>
        /// 楼层数
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "FloorsCount")]
        public int FloorsCount { get; set; }

        /// <summary>
        /// 房间数
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "RoomsCount")]
        public int RoomsCount{ get;set;}

        /// <summary>
        /// 行政区划ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "AdminID")]
        public int AdminID{ get; set;}

        /// <summary>
        /// 行政区划
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "AdminName")]
        public string AdminName{get;set;}

        /// <summary>
        /// 街路巷ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "StreetID")]
        public int StreetID{ get;set;}
        
        /// <summary>
        /// 街路巷号码ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "StreetNum")]
        public int StreetNum{ get;set;}

        /// <summary>
        /// 坐落地址
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Address")]
        public string Address{ get;set;}

        public int CompareTo(MBuilding other)
        {
            if (Building_ID > other.Building_ID) return 1;
            if (Building_ID < other.Building_ID) return -1;
            return 0;
        }
    }
}
