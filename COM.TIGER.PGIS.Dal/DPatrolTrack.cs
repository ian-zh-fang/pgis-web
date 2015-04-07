using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DPatrolTrack : DBase
    {
        public List<Model.MPatrolTrack> GetTracks()
        {
            return GetEntities<Model.MPatrolTrack>();
        }

        public Model.TotalClass<List<Model.MPatrolTrack>> PageTracks(int index, int size)
        {
            return PagingEntities<Model.MPatrolTrack>(index, size);
        }

        public Model.TotalClass<List<Model.MMonitorDevice>> PageDevices(int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MMonitorDevice>>>("Page", "MonitorDevice",
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public List<Model.MMonitorDevice> GetDevicesOnTrack(int trackid)
        {
            return Post<List<Model.MMonitorDevice>>("GetDevicesOnTrack", "PatrolTrack", 
                string.Format("trackid={0}", trackid)).Result;
        }

        public List<Model.MMonitorDeviceEx> GetAllDevicesForTree()
        {
            return GetEntities<Model.MMonitorDeviceEx>();
        }

        public int AddTrackDevices(int trackid, string deviceids)
        {
            return Post<int>("AddTrackDevices", "PatrolTrack",
                string.Format("trackid={0}", trackid),
                string.Format("deviceids={0}", deviceids)).Result;
        }

        public int AddRecord(Model.MPatrolRecord e)
        {
            return Post<int>("InsertRecord", "PatrolTrack", string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public Model.TotalClass<List<Model.MPatrolRecord>> PagingRecords(string devicename, string officername, DateTime? timestart, DateTime? timeend, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPatrolRecord>>>("PagingRecords", "PatrolTrack",
                string.Format("devicename={0}", devicename),
                string.Format("officername={0}", officername),
                string.Format("timestart={0}", timestart),
                string.Format("timeend={0}", timeend),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }
    }
}
