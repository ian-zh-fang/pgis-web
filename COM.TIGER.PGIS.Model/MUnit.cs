using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Unit", ModelName = "Units")]
    [System.Runtime.Serialization.DataContract(Name = "unit", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MUnit : MBase, IComparable<MUnit>
    {
        /// <summary>
        /// 单元标识符
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Unit_ID")]
        public int Unit_ID { get; set; }

        /// <summary>
        /// 单元名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "UnitName")]
        public string UnitName { get; set; }

        /// <summary>
        /// 所属楼房ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "OwnerInfoID")]
        public int OwnerInfoID { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Sort")]
        public int Sort { get; set; }

        private List<Model.MRooms> _rooms = new List<MRooms>();
        /// <summary>
        /// 当前单元内房间信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Rooms")]
        public Model.MRooms[] Rooms
        {
            get { return _rooms.ToArray(); }
            set { Add(value); }
        }

        /// <summary>
        /// 批量添加单元房间信息，如果含有不存在房间信息
        /// </summary>
        /// <param name="rooms"></param>
        public void Add(params Model.MRooms[] rooms)
        {
            _rooms.AddRange(rooms.Where(t => !_rooms.Exists(x => t.Room_ID == x.Room_ID)));
        }

        public int CompareTo(MUnit other)
        {
            if (Unit_ID > other.Unit_ID) return 1;
            if (Unit_ID < other.Unit_ID) return -1;
            return 0;
        }
    }

    [System.Runtime.Serialization.DataContract(Name = "unitex", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MUnitEx : MUnit
    {

        private string _address;
        [System.Runtime.Serialization.DataMember(Name = "Address")]
        public string Address 
        {
            get { return _address; }
            set { _address = value; }
        }
    }
}
