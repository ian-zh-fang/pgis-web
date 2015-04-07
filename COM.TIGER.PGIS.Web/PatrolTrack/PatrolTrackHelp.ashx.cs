using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.PatrolTrack
{
    /// <summary>
    /// 电子巡逻 的摘要说明
    /// </summary>
    public class PatrolTrackHelp : PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IPatrolTrack))]
        IFun.IPatrolTrack _instance;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "add":
                    AddTrack();
                    break;
                case "upd":
                    UpdateTrack();
                    break;
                case "del":
                    DeleteTrack();
                    break;
                case "alltracks":
                    //获取所有的线路信息
                    break;
                case "track":
                    PageTracks();
                    break;
                case "trackdevice":
                    GetDevicesONTrack();
                    break;
                case "alldevice":
                    GetAllDevicesForTree();
                    break;
                case "savedevice":
                    SaveTrackDevices();
                    break;
                case "formsubmit":
                    //保存查看设备跟踪
                    SaveDeviceTrack();
                    break;
                case "pagerecords":
                    PageRecords();
                    break;
                default:
                    break;
            }
        }

        private void PageRecords()
        {
            var devicename = HttpContext.Current.Request["devicename"];
            var officername = HttpContext.Current.Request["officername"];
            var timestart = string.IsNullOrWhiteSpace(HttpContext.Current.Request["timestart"]) ? null : (DateTime?)DateTime.Parse(HttpContext.Current.Request["timestart"]);
            var timeend = string.IsNullOrWhiteSpace(HttpContext.Current.Request["timeend"]) ? null : (DateTime?)DateTime.Parse(HttpContext.Current.Request["timeend"]);
            var data = _instance.PagingRecords(devicename, officername, timestart, timeend, CurrentPage, PagerSize);
            Execute(HttpContext.Current, data, true);
        }

        private void SaveDeviceTrack()
        {
            var e = GetQueryParamsCollection<Model.MPatrolRecord>();
            var data = _instance.AddRecord(e);
            Execute(HttpContext.Current, data);
        }

        private void SaveTrackDevices()
        {
            var id = int.Parse(HttpContext.Current.Request["id"]);
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.AddTrackDevices(id, ids);
            Execute(HttpContext.Current, data);
        }

        private void GetAllDevicesForTree()
        {
            var data = _instance.GetAllDevicesForTree();
            Execute(HttpContext.Current, data, true);
        }

        private void PageTracks()
        {
            var data = _instance.PageTracks(CurrentPage, PagerSize);
            Execute(HttpContext.Current, data, true);
        }

        private void GetDevicesONTrack()
        {
            var trackid = string.IsNullOrEmpty(HttpContext.Current.Request["trackid"]) ? 0 : int.Parse(HttpContext.Current.Request["trackid"]);
            var data = _instance.GetDevicesOnTrack(trackid);
            Execute(HttpContext.Current, data,  true);
        }

        private void AddTrack()
        {
            var e = GetQueryParamsCollection<Model.MPatrolTrack>();
            var data = _instance.AddEntity(e);
            Execute(HttpContext.Current, data);
        }

        private void UpdateTrack()
        {
            var e = GetQueryParamsCollection<Model.MPatrolTrack>();
            var data = _instance.UpdateEntity(e);
            Execute(HttpContext.Current, data);
        }

        private void DeleteTrack()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteEntities(ids);
            Execute(HttpContext.Current, data);
        }

        public new bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}