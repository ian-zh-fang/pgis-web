
/*****************************************************
*   Author: Ian.Fun
*   File: PatrolTrack.cs
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
    [Common.Attr.RemoteController(ControllerName = "PatrolTrack", ModelName = "PatrolTracks")]
    [System.Runtime.Serialization.DataContract(Name = "PatrolTrack", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MPatrolTrack :MBase
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
        private string _SettedTime;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "SettedTime")]
        public string SettedTime
        {
            get{ return _SettedTime;}
            set{ _SettedTime = value;}
        }
        private string _UpdatedTime;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "UpdatedTime")]
        public string UpdatedTime
        {
            get{ return _UpdatedTime;}
            set{ _UpdatedTime = value;}
        }

        [System.Runtime.Serialization.DataMember(Name = "Devices")]
        public Model.MMonitorDevice[] Devices { get; set; }
    }
}

