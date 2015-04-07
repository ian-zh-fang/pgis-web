using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 电子巡逻
    /// </summary>
    public interface IPatrolTrack:IFunBasic<Model.MPatrolTrack>
    {
        //int AddEntity()

        /// <summary>
        /// 获取所有的路线信息，返回一个 Model.MPatrolTrack 的集合
        /// </summary>
        /// <returns></returns>
        List<Model.MPatrolTrack> GetTracks();

        /// <summary>
        /// 分页所有巡逻路线信息，并获取指定页码的数据；返回一个 Model.MPatrolTrack 的集合 
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每页条目数</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MPatrolTrack>> PageTracks(int index, int size);

        /// <summary>
        /// 分页所有的监控设备信息，并获取指定页码数据；返回一个 Model.MMonitorDevice 的集合
        /// </summary>
        /// <param name="index">指定页码</param>
        /// <param name="size">每页条目数</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MMonitorDevice>> PageDevices(int index, int size);

        /// <summary>
        /// 获取指定巡逻路线的所有设备信息。返回一个 Model.MMonitorDevice 的集合
        /// </summary>
        /// <param name="trackid"></param>
        /// <returns></returns>
        List<Model.MMonitorDevice> GetDevicesOnTrack(int trackid);

        /// <summary>
        /// 获取树形式的设备信息
        /// </summary>
        /// <returns></returns>
        List<Model.MMonitorDeviceEx> GetAllDevicesForTree();

        /// <summary>
        /// 变更指定线路的监控设备信息
        /// </summary>
        /// <param name="trackid">指定的线路ID</param>
        /// <param name="deviceids">监控设备ID组</param>
        /// <returns></returns>
        int AddTrackDevices(int trackid, string deviceids);

        /// <summary>
        /// 添加新的巡查记录
        /// </summary>
        /// <param name="e">巡查记录</param>
        /// <returns></returns>
        int AddRecord(Model.MPatrolRecord e);

        /// <summary>
        /// 分页巡逻记录信息，并获取指定页码的记录信息。返回一个 Model.TotalClass&lt;List&lt;Model.MPatrolRecord> 对象，包含 Model.MPatrolRecord 类型的实例集合.
        /// </summary>
        /// <param name="devicename">设备名称</param>
        /// <param name="officername">警员名称</param>
        /// <param name="timestart">开始时间</param>
        /// <param name="timeend">结束时间</param>
        /// <param name="index">指定页码</param>
        /// <param name="size">每页条目数</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MPatrolRecord>> PagingRecords(string devicename, string officername, DateTime? timestart, DateTime? timeend, int index, int size);
    }
}
