using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DGlobalPositionSystem:DBase
    {
        protected const string CONTROLNAME = "GlobalPositionSystem";

        /// <summary>
        /// 添加警力和设备绑定信息
        /// </summary>
        /// <param name="t">指定需要添加的实体</param>
        /// <returns></returns>
        public int AddDeviceBinding(Model.MGpsDevice t)
        {
            return Post<int>(
                "AddDeviceBinding", 
                CONTROLNAME, 
                string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(t)))
                .Result;
        }

        /// <summary>
        /// 修改警力和设备绑定信息
        /// </summary>
        /// <param name="t">指定需要变更的实体</param>
        /// <returns></returns>
        public int ModifyDeviceBinding(Model.MGpsDevice t)
        {
            return Post<int>(
                "ModifyDeviceBinding",
                CONTROLNAME,
                string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(t)))
                .Result;
        }

        /// <summary>
        /// 删除警力和设备绑定信息
        /// <para>同时移除当前设备的跟踪信息</para>
        /// </summary>
        /// <param name="ids">标识需要移除的警力和设备绑定信息ID</param>
        /// <returns></returns>
        public int RemoveDeviceBinding(params string[] ids)
        {
            return Post<int>(
                "RemoveDeviceBinding",
                CONTROLNAME,
                string.Format("ids={0}", string.Join(",", ids)))
                .Result;
        }

        /// <summary>
        /// 分页所有的设备绑定信息，并获取指定页码的设备绑定信息
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每一页绑定信息数量</param>
        /// <returns></returns>
        public Model.TotalClass<List<Model.MGpsDevice>> PageDevices(int index, int size)
        {
            return Get<Model.TotalClass<List<Model.MGpsDevice>>>(
                "PageDevices",
                CONTROLNAME,
                string.Format("index={0}", index),
                string.Format("size={0}", size))
                .Result;
        }

        /// <summary>
        /// 分页指定设备编号的设备绑定信息，并获取指定页码的设备绑定信息
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每一页绑定信息数量</param>
        /// <param name="number">指定的设备编号</param>
        /// <returns></returns>
        public Model.TotalClass<List<Model.MGpsDevice>> PageDevicesAtNumber(int index, int size, string number)
        {
            return Get<Model.TotalClass<List<Model.MGpsDevice>>>(
                "PageDevicesAtNumber",
                CONTROLNAME,
                string.Format("index={0}", index),
                string.Format("size={0}", size),
                string.Format("number={0}", number))
                .Result;
        }

        /// <summary>
        /// 分页指定警员编号的设备绑定信息，并获取指定页码的设备绑定信息
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每一页绑定信息数量</param>
        /// <param name="officerid">指定的警员编号</param>
        /// <returns></returns>
        public Model.TotalClass<List<Model.MGpsDevice>> PageDevicesAtOfficer(int index, int size, string officerid)
        {
            return Get<Model.TotalClass<List<Model.MGpsDevice>>>(
                "PageDevicesAtOfficer",
                CONTROLNAME,
                string.Format("index={0}", index),
                string.Format("size={0}", size),
                string.Format("officerid={0}", officerid))
                .Result;
        }

        /// <summary>
        /// 分页指定警车编号的设备绑定信息，并获取指定页码的设备绑定信息
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每一页绑定信息数量</param>
        /// <param name="carid">指定的警车编号</param>
        /// <returns></returns>
        public Model.TotalClass<List<Model.MGpsDevice>> PageDevicesAtCar(int index, int size, string carid)
        {
            return Get<Model.TotalClass<List<Model.MGpsDevice>>>(
                "PageDevicesAtCar",
                CONTROLNAME,
                string.Format("index={0}", index),
                string.Format("size={0}", size),
                string.Format("carid={0}", carid))
                .Result;
        }

        /// <summary>
        /// 获取所有警力的当前位置信息
        /// </summary>
        /// <returns></returns>
        public List<Model.MGpsDeviceTrack> GetDevicesCurrentPosition()
        {
            return Get<List<Model.MGpsDeviceTrack>>(
                "GetDevicesCurrentPosition",
                CONTROLNAME)
                .Result;
        }

        /// <summary>
        /// 获取指定设备的在指定时间段内的所有位置信息
        /// </summary>
        /// <param name="deviceId">指定的设备编号</param>
        /// <param name="start">指定时间段开始时间</param>
        /// <param name="end">指定时间段结束时间</param>
        /// <returns></returns>
        public List<Model.MGpsDeviceTrack> GetDeviceHistoryPoints(string deviceId, DateTime start, DateTime end)
        {
            return Get<List<Model.MGpsDeviceTrack>>(
                "GetDeviceHistoryPoints",
                CONTROLNAME,
                string.Format("deviceId={0}", deviceId),
                string.Format("start={0}", start.ToLocalTime()),
                string.Format("end={0}", end.ToLocalTime()))
                .Result;
        }

        /// <summary>
        /// 获取指定坐标区域内的所有设备位置信息
        /// </summary>
        /// <param name="coords">指定坐标区域的各个定点坐标信息</param>
        /// <returns></returns>
        public List<Model.MGpsDeviceTrack> GetDevicesCurrentPostionAtPanel(string coords)
        {
            return Get<List<Model.MGpsDeviceTrack>>(
                "GetDevicesCurrentPostionAtPanel",
                CONTROLNAME,
                string.Format("coords={0}", coords))
                .Result;
        }
    }
}
