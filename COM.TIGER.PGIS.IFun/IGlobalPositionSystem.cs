using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    public interface IGlobalPositionSystem
    {
        //添加警力和设备绑定信息
        //修改警力和设备绑定信息
        //删除警力和设备绑定信息
        //分页查询经历和设备绑定信息（条件包括警员编号，警车编号，设备编号）

        //显示所有警力（警员和警车）的分布图
        //显示指定警力（警员和警车）的巡逻图

        /// <summary>
        /// 添加警力和设备绑定信息
        /// </summary>
        /// <param name="t">指定需要添加的实体</param>
        /// <returns></returns>
        int AddDeviceBinding(Model.MGpsDevice t);

        /// <summary>
        /// 修改警力和设备绑定信息
        /// </summary>
        /// <param name="t">指定需要变更的实体</param>
        /// <returns></returns>
        int ModifyDeviceBinding(Model.MGpsDevice t);

        /// <summary>
        /// 删除警力和设备绑定信息
        /// <para>同时移除当前设备的跟踪信息</para>
        /// </summary>
        /// <param name="ids">标识需要移除的警力和设备绑定信息ID</param>
        /// <returns></returns>
        int RemoveDeviceBinding(params string[] ids);

        /// <summary>
        /// 分页所有的设备绑定信息，并获取指定页码的设备绑定信息
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每一页绑定信息数量</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MGpsDevice>> PageDevices(int index, int size);

        /// <summary>
        /// 分页指定设备编号的设备绑定信息，并获取指定页码的设备绑定信息
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每一页绑定信息数量</param>
        /// <param name="number">指定的设备编号</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MGpsDevice>> PageDevicesAtNumber(int index, int size, string number);

        /// <summary>
        /// 分页指定警员编号的设备绑定信息，并获取指定页码的设备绑定信息
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每一页绑定信息数量</param>
        /// <param name="officerid">指定的警员编号</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MGpsDevice>> PageDevicesAtOfficer(int index, int size, string officerid);

        /// <summary>
        /// 分页指定警车编号的设备绑定信息，并获取指定页码的设备绑定信息
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每一页绑定信息数量</param>
        /// <param name="cardid">指定的警车编号</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MGpsDevice>> PageDevicesAtCar(int index, int size, string carid);

        /// <summary>
        /// 获取所有警力的当前位置信息
        /// </summary>
        /// <returns></returns>
        List<Model.MGpsDeviceTrack> GetDevicesCurrentPosition();

        /// <summary>
        /// 获取指定设备的在指定时间段内的所有位置信息
        /// </summary>
        /// <param name="deviceId">指定的设备编号</param>
        /// <param name="start">指定时间段开始时间</param>
        /// <param name="end">指定时间段结束时间</param>
        /// <returns></returns>
        List<Model.MGpsDeviceTrack> GetDeviceHistoryPoints(string deviceId, DateTime start, DateTime end);

        /// <summary>
        /// 获取指定坐标区域内的所有设备位置信息
        /// </summary>
        /// <param name="coords">指定坐标区域的各个定点坐标信息</param>
        /// <returns></returns>
        List<Model.MGpsDeviceTrack> GetDevicesCurrentPostionAtPanel(string coords);
    }
}
