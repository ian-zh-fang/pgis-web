
/*****************************************************
*   Author: Ian.Fun
*   File: PatrolRecord.cs
*   Version: 1.0.0.0
*   Description: 
*   Date: 2014-08-27 10:45
******************************************************
*/

using System;

namespace COM.TIGER.PGIS.Model
{
    ///<summary>
    /// 
    ///</summary>
    [Common.Attr.RemoteController(ControllerName = "PatrolRecord", ModelName = "PatrolRecords")]
    [System.Runtime.Serialization.DataContract(Name = "PatrolRecord", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MPatrolRecord :MBase
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
        private int _PatrolID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "PatrolID")]
        public int PatrolID
        {
            get{ return _PatrolID;}
            set{ _PatrolID = value;}
        }
        private string _Patrol;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Patrol")]
        public string Patrol
        {
            get{ return _Patrol;}
            set{ _Patrol = value;}
        }
        private string _CurrentTime;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "CurrentTime")]
        public string CurrentTime
        {
            get{ return _CurrentTime;}
            set
            { 
                _CurrentTime = value;
            }
        }
        private string _Remark;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Remark")]
        public string Remark
        {
            get{ return _Remark;}
            set{ _Remark = value;}
        }
        private int _PatrolMonitorID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "PatrolMonitorID")]
        public int PatrolMonitorID
        {
            get { return _PatrolMonitorID; }
            set { _PatrolMonitorID = value; }
        }

        /// <summary>
        /// 设备ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "DeviceID")]
        public int DeviceID { get; set; }

        /// <summary>
        /// 设备
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Device")]
        public MMonitorDevice Device { get; set; }

        /// <summary>
        /// 线路
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name="Track")]
        public MPatrolTrack Track { get; set; }

        /// <summary>
        /// 巡逻人员
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Officer")]
        public MOfficer Officer { get; set; }
    }
}

