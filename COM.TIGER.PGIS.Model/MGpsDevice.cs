
/*****************************************************
*   Author: Ian.Fun
*   File: GpsDevice.cs
*   Version: 1.0.0.0
*   Description: 
*   Date: 2014-08-27 10:41
******************************************************
*/

using System;

namespace COM.TIGER.PGIS.Model
{
    ///<summary>
    /// 
    ///</summary>
    [Common.Attr.RemoteController(ControllerName = "GpsDevice", ModelName = "GpsDevices")]
    [System.Runtime.Serialization.DataContract(Name = "GpsDevice", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MGpsDevice :MBase
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
        private string _DeviceID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "DeviceID")]
        public string DeviceID
        {
            get{ return _DeviceID;}
            set{ _DeviceID = value;}
        }
        private string _OfficerID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "OfficerID")]
        public string OfficerID
        {
            get{ return _OfficerID;}
            set{ _OfficerID = value;}
        }
        private DateTime _BindTime = DateTime.Now;
        ///<summary>
        /// 
        ///</summary>
        public DateTime BindTime
        {
            get{ return _BindTime;}
            set{ _BindTime = value;}
        }

        private string _BdTime;
        [System.Runtime.Serialization.DataMember(Name = "BindTime")]
        public string BdTime
        {
            get { return _BdTime = _BdTime ?? BindTime.ToString("yyyy-MM-dd HH:mm:ss"); }
            set
            {
                DateTime.TryParse(value, out _BindTime);
                _BdTime = value;
            }
        }

        private int _CarID;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "CarID")]
        public int CarID
        {
            get{ return _CarID;}
            set{ _CarID = value;}
        }
        private string _CarNum;
        ///<summary>
        /// 
        ///</summary>
        [System.Runtime.Serialization.DataMember(Name = "CarNum")]
        public string CarNum
        {
            get { return _CarNum = _CarNum ?? GetPoliceCarNumber(); }
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    string[] buf = value.Split(',');
                    if (buf.Length >= 2)
                    {
                        ProvinceLessName = buf[0];
                        Number = buf[1];
                    }
                }
                _CarNum = value;
            }
        }

        /// <summary>
        /// 获取设备类型
        /// <para>0：默认</para>
        /// <para>1：警员</para>
        /// <para>2：警车</para>
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "DType")]
        public GPSDeviceType DType
        {
            get 
            {
                if (!string.IsNullOrWhiteSpace(_OfficerID))
                    return GPSDeviceType.OFFICER;

                if (!string.IsNullOrWhiteSpace(_CarNum))
                    return GPSDeviceType.CAR;

                return GPSDeviceType.NORMAL;
            }
        }

        private string _Number;
        [System.Runtime.Serialization.DataMember(Name = "Number")]
        public string Number
        {
            get { return _Number; }
            set { _Number = value; }
        }

        private string _ProvinceLessName;
        [System.Runtime.Serialization.DataMember(Name = "ProvinceLessName")]
        public string ProvinceLessName
        {
            get { return _ProvinceLessName; }
            set { _ProvinceLessName = value; }
        }

        private string GetPoliceCarNumber()
        {
            //if (string.IsNullOrWhiteSpace(_Number))
            //    return string.Empty;

            return string.Join(",", ProvinceLessName, Number);
        }
    }

    /// <summary>
    /// GPS设备类型
    /// </summary>
    public enum GPSDeviceType : byte
    {
        /// <summary>
        /// 默认
        /// </summary>
        NORMAL = 0x00,
        /// <summary>
        /// 警员
        /// </summary>
        OFFICER = 0x01,
        /// <summary>
        /// 警车
        /// </summary>
        CAR = 0x02,
    }
}

