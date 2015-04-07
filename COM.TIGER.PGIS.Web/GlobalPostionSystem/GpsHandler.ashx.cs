using System;
using System.Collections.Generic;
using System.Web;
using System.ComponentModel.Composition;
using COM.TIGER.PGIS.IFun;

namespace COM.TIGER.PGIS.Web.GlobalPostionSystem
{
    /// <summary>
    /// GpsHandler 的摘要说明
    /// </summary>
    public class GpsHandler : PageBase, IHttpHandler
    {
        private const string PARAMERNAME = "req";

        [Import(typeof(IGlobalPositionSystem))]
        IGlobalPositionSystem _instance;

        public new void ProcessRequest(HttpContext context)
        {
            base.InitContainer(context);
            switch(context.Request[PARAMERNAME])
            {
                case "add"://添加设备绑定信息
                    AddDeviceBinding();
                    break;
                case "mod"://修改设备绑定信息
                    ModifyDeviceBinding();
                    break;
                case "del"://移除设备绑定信息
                    RemoveDeviceBinding();
                    break;
                case "pgallbind"://分页所有设备绑定信息
                    PageDevices();
                    break;
                case "pgbindatnum"://分页指定设备编号绑定信息
                    PageDevicesAtNumber();
                    break;
                case "pgbindatoff"://分页指定警员编号绑定信息
                    PageDevicesAtOfficer();
                    break;
                case "pgbindatcar"://分页指定警车编号绑定信息
                    PageDevicesAtCar();
                    break;
                case "currentpts"://获取当前所有警力（警员和警车）当前位置信息
                    GetDevicesCurrentPosition();
                    break;
                case "historypts"://获取指定设备在指定时间段内的所有定位记录
                    GetDeviceHistoryPoints();
                    break;
                case "qcoords":
                    QueryAtPanel();//框选操作
                    break;
                default:
                    ExecuteCore("啊哦，发生错误了...");
                    break;
            }
        }

        private void QueryAtPanel()
        {
            string coords = Request["coords"];
            List<Model.MGpsDeviceTrack> data = _instance.GetDevicesCurrentPostionAtPanel(coords);
            ExecuteSerialzor(data);
        }

        private void GetDeviceHistoryPoints()
        {
            try
            {
                string id = Request["Number"];
                DateTime start = DateTime.Now.AddDays(-1);
                DateTime end = start.AddDays(1);
                string startStr = Request["TimeStart"];
                string endStr = Request["TimeEnd"];
                DateTime.TryParse(startStr, out start);
                DateTime.TryParse(endStr, out end);

                List<Model.MGpsDeviceTrack> data = _instance.GetDeviceHistoryPoints(id, start, end);
                ExecuteSerialzor(data);
            }
            catch(Exception e)
            {
                ExecuteObj(e.Message, false, "EXCEPTION");
            }
        }

        private void GetDevicesCurrentPosition()
        {
            List<Model.MGpsDeviceTrack> data = _instance.GetDevicesCurrentPosition();
            ExecuteSerialzor(data);
        }

        private void PageDevicesAtCar()
        {
            string id = Request["num"];
            Model.TotalClass<List<Model.MGpsDevice>> data = _instance.PageDevicesAtCar(CurrentPage, PagerSize, id);
            ExecuteSerialzor(data);
        }

        private void PageDevicesAtOfficer()
        {
            string id = Request["num"];
            Model.TotalClass<List<Model.MGpsDevice>> data = _instance.PageDevicesAtOfficer(CurrentPage, PagerSize, id);
            ExecuteSerialzor(data);
        }

        private void PageDevicesAtNumber()
        {
            string id = Request["num"];
            Model.TotalClass<List<Model.MGpsDevice>> data = _instance.PageDevicesAtNumber(CurrentPage, PagerSize, id);
            ExecuteSerialzor(data);
        }

        private void PageDevices()
        {
            Model.TotalClass<List<Model.MGpsDevice>> data = _instance.PageDevices(CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void RemoveDeviceBinding()
        {
            string ids = Request["ids"];
            int data = _instance.RemoveDeviceBinding(ids);
            ExecuteObj(data);
        }

        private void ModifyDeviceBinding()
        {
            Model.MGpsDevice t = GetQueryParamsCollection<Model.MGpsDevice>();
            int data = _instance.ModifyDeviceBinding(t);
            ExecuteObj(data);
        }

        private void AddDeviceBinding()
        {
            Model.MGpsDevice t = GetQueryParamsCollection<Model.MGpsDevice>();
            int data = _instance.AddDeviceBinding(t);
            ExecuteObj(data);
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