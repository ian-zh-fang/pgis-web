using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using COM.TIGER.PGIS.IFun;

namespace COM.TIGER.PGIS.AddIn.GPS
{
    [Export(typeof(IGlobalPositionSystem))]
    public class GlobalPositionSystem:IGlobalPositionSystem
    {
        private static readonly Dal.DGlobalPositionSystem _instance;
        static GlobalPositionSystem()
        {
            _instance = new Dal.DGlobalPositionSystem();
        }

        /// <summary>
        /// 添加警力和设备绑定信息
        /// </summary>
        /// <param name="t">指定需要添加的实体</param>
        /// <returns></returns>
        public int AddDeviceBinding(Model.MGpsDevice t)
        {
            return _instance.AddDeviceBinding(t);
        }

        /// <summary>
        /// 修改警力和设备绑定信息
        /// </summary>
        /// <param name="t">指定需要变更的实体</param>
        /// <returns></returns>
        public int ModifyDeviceBinding(Model.MGpsDevice t)
        {
            return _instance.ModifyDeviceBinding(t);
        }

        /// <summary>
        /// 删除警力和设备绑定信息
        /// <para>同时移除当前设备的跟踪信息</para>
        /// </summary>
        /// <param name="ids">标识需要移除的警力和设备绑定信息ID</param>
        /// <returns></returns>
        public int RemoveDeviceBinding(params string[] ids)
        {
            return _instance.RemoveDeviceBinding(ids);
        }

        /// <summary>
        /// 分页所有的设备绑定信息，并获取指定页码的设备绑定信息
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每一页绑定信息数量</param>
        /// <returns></returns>
        public Model.TotalClass<List<Model.MGpsDevice>> PageDevices(int index, int size)
        {
            return _instance.PageDevices(index, size);
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
            return _instance.PageDevicesAtNumber(index, size, number);
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
            return _instance.PageDevicesAtOfficer(index, size, officerid);
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
            return _instance.PageDevicesAtCar(index, size, carid);
        }

        /// <summary>
        /// 获取所有警力的当前位置信息
        /// </summary>
        /// <returns></returns>
        public List<Model.MGpsDeviceTrack> GetDevicesCurrentPosition()
        {
            return _instance.GetDevicesCurrentPosition();
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
            return _instance.GetDeviceHistoryPoints(deviceId, start, end);
        }
        
        public List<Model.MGpsDeviceTrack> GetDevicesCurrentPostionAtPanel(string coords)
        {
            return _instance.GetDevicesCurrentPostionAtPanel(coords);
        }
    }
}
