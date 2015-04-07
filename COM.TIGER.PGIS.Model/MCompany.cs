using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Company", ModelName = "Companys")]
    [System.Runtime.Serialization.DataContract(Name = "company", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MCompany : MBase, IComparable<MCompany>
    {
        /// <summary>
        /// 单位表ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; } 
        /// <summary>
        /// 单位大类ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "TypeID")]
        public int TypeID { get; set; }

        /// <summary>
        /// 单位大类
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "TypeName")]
        public string TypeName { get; set; }

        /// <summary>
        /// 单位小类ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "GenreID")]
        public int GenreID { get; set; }

        /// <summary>
        /// 单位小类
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "GenreName")]
        public string GenreName { get; set; }

        /// <summary>
        /// 单位名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

        /// <summary>
        /// 地址ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "AddressID")]
        public int AddressID { get; set; }

        /// <summary>
        /// 行业类型ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "TradeID")]
        public int TradeID { get; set; }

        /// <summary>
        /// 行业类型
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "TradeName")]
        public string TradeName { get; set; }

        /// <summary>
        /// 注册资金
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Capital")]
        public decimal Capital { get; set; }

        /// <summary>
        /// 法人
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Corporation")]
        public string Corporation { get; set; }

        /// <summary>
        /// 经营面积
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Square")]
        public float Square { get; set; }

        private DateTime _StartTime;
        ///<summary>
        /// 
        ///</summary>
        public DateTime StartTime
        {
            get { return _StartTime; }
            set
            {
                _StartTime = value;
                StartTimeStr = value.ToString("yyyy-MM-dd");
            }
        }

        [System.Runtime.Serialization.DataMember(Name = "StartTimeStr")]
        public string StartTimeStr { get; set; }

        /// <summary>
        /// 单位电话
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Tel")]
        public string Tel { get; set; }

        /// <summary>
        /// 营业执照编号
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "LicenceNum")]
        public string LicenceNum { get; set; }

        private DateTime _LicenceStartTime;
        ///<summary>
        /// 
        ///</summary>
        public DateTime LicenceStartTime
        {
            get { return _LicenceStartTime; }
            set
            {
                _LicenceStartTime = value;
                LicenceStartTimeStr = value.ToString("yyyy-MM-dd");
            }
        }

        [System.Runtime.Serialization.DataMember(Name = "LicenceStartTimeStr")]
        public string LicenceStartTimeStr { get; set; }

        private DateTime _LicenceEndTime;
        ///<summary>
        /// 
        ///</summary>
        public DateTime LicenceEndTime
        {
            get { return _LicenceEndTime; }
            set
            {
                _LicenceEndTime = value;
                LicenceEndTimeStr = value.ToString("yyyy-MM-dd");
            }
        }

        [System.Runtime.Serialization.DataMember(Name = "LicenceEndTimeStr")]
        public string LicenceEndTimeStr { get; set; }

        /// <summary>
        /// 主营经营范围
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "MainFrame")]
        public string MainFrame { get; set; }

        /// <summary>
        /// 兼营经营范围
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Concurrently")]
        public string Concurrently { get; set; }

        /// <summary>
        /// 外来务工人数
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "MigrantWorks")]
        public int MigrantWorks { get; set; }

        /// <summary>
        /// 消防等级
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "FireRating")]
        public int FireRating { get; set; }

        /// <summary>
        /// 所属管辖机关ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "OrganID")]
        public int OrganID { get; set; }

        /// <summary>
        /// 所属管辖机关
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "OrganName")]
        public string OrganName { get; set; }

        /// <summary>
        /// 所在房间ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "RoomID")]
        public string RoomID { get; set; }

        /// <summary>
        /// 详细地址描述
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Addr")]
        public string Addr { get; set; }

        /// <summary>
        /// 详细地址信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name="Address")]
        public MAddress Address { get; set; }

        public int CompareTo(MCompany other)
        {
            if (ID > other.ID) return 1;
            if (ID < other.ID) return -1;
            return 0;
        }
    }
}
