
/*****************************************************
*   Author: Ian.Fun
*   File: PatrolMonitor.cs
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
    [Common.Attr.RemoteController(ControllerName = "PatrolMonitor", ModelName = "PatrolMonitors")]
    [System.Runtime.Serialization.DataContract(Name = "PatrolMonitor", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MPatrolMonitor :MBase
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
        private int _TrackID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "TrackID")]
        public int TrackID
        {
            get{ return _TrackID;}
            set{ _TrackID = value;}
        }
        private int _MonitorID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "MonitorID")]
        public int MonitorID
        {
            get{ return _MonitorID;}
            set{ _MonitorID = value;}
        }
        private int _Sort;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "Sort")]
        public int Sort
        {
            get{ return _Sort;}
            set{ _Sort = value;}
        }
    }
}

