using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace COM.TIGER.PGIS.AddIn.PatrolTrack
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IPatrolTrack))]
    public class PatrolTrack : IFun.IPatrolTrack
    {
        Dal.DPatrolTrack _instance = new Dal.DPatrolTrack();

        public List<Model.MPatrolTrack> GetTracks()
        {
            return _instance.GetTracks();
        }

        public Model.TotalClass<List<Model.MPatrolTrack>> PageTracks(int index, int size)
        {
            return _instance.PageTracks(index, size);
        }

        public Model.TotalClass<List<Model.MMonitorDevice>> PageDevices(int index, int size)
        {
            return _instance.PageDevices(index, size);
        }

        public List<Model.MMonitorDevice> GetDevicesOnTrack(int trackid)
        {
            return _instance.GetDevicesOnTrack(trackid);
        }
        
        public int AddEntity(Model.MPatrolTrack t)
        {
            return _instance.AddEntity<Model.MPatrolTrack>(t);
        }

        public int UpdateEntity(Model.MPatrolTrack t)
        {
            return _instance.UpdateEntity<Model.MPatrolTrack>(t);
        }

        public int DeleteEntities(params string[] ids)
        {
            return _instance.DeleteEntities<Model.MPatrolTrack>(ids);
        }
        
        public List<Model.MMonitorDeviceEx> GetAllDevicesForTree()
        {
            return _instance.GetAllDevicesForTree();
        }
        
        public int AddTrackDevices(int trackid, string deviceids)
        {
            return _instance.AddTrackDevices(trackid, deviceids);
        }
        
        public int AddRecord(Model.MPatrolRecord e)
        {
            return _instance.AddRecord(e);
        }

        public Model.TotalClass<List<Model.MPatrolRecord>> PagingRecords(string devicename, string officername, DateTime? timestart, DateTime? timeend, int index, int size)
        {
            return _instance.PagingRecords(devicename, officername, timestart, timeend, index, size);
        }
    }
}
