using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 预案
    /// </summary>
    public interface IPreplan
    {
        /// <summary>
        /// 分页所有的预案数据记录，并获取指定页码的数据记录
        /// </summary>
        /// <param name="index">指定的页码</param>
        /// <param name="size">每页条目数</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MPlan>> Paging(int index, int size);

        /// <summary>
        /// 获取指定ID的预案数据
        /// <para>如果没有指定ID，那么获取所有的预案信息</para>
        /// </summary>
        /// <param name="ids">需要指定的ID</param>
        /// <returns></returns>
        List<Model.MPlan> GetPlans(params string[] ids);

        /// <summary>
        /// 获取指定ID的标注信息
        /// </summary>
        /// <param name="ids">指定预案ID</param>
        /// <returns></returns>
        List<Model.MTag> GetPlanMarks(params string[] ids);

        /// <summary>
        /// 获取指定ID的文档信息
        /// </summary>
        /// <param name="ids">指定预案ID</param>
        /// <returns></returns>
        List<Model.MFile> GetPlanFiles(params string[] ids);

        /// <summary>
        /// 添加新的数据记录
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        int InsertEntity(Model.MPlan e);

        /// <summary>
        /// 保存预案标注信息
        /// </summary>
        /// <param name="e"></param>
        /// <param name="planid"></param>
        /// <returns></returns>
        int InsertEntity(Model.MTag e, int planid);

        /// <summary>
        /// 保存预案文档信息
        /// </summary>
        /// <param name="e"></param>
        /// <param name="planid"></param>
        /// <returns></returns>
        int InsertEntity(Model.MFile e, int planid);

        /// <summary>
        /// 批量添加预案文档数据
        /// </summary>
        /// <param name="plan"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        int InsertEntity(Model.MPlan plan, params Model.MFile[] files);

        /// <summary>
        /// 批量添加预案文档数据
        /// </summary>
        /// <param name="files"></param>
        /// <param name="planid"></param>
        /// <returns></returns>
        int InsertEntity(Model.MFile[] files, int planid);

        /// <summary>
        /// 移除指定的文档信息
        /// </summary>
        /// <param name="files"></param>
        /// <returns></returns>
        int DeleteEntities(params Model.MFile[] files);

        /// <summary>
        /// 更新指定的数据记录
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        int UpdateEntity(Model.MPlan e);

        /// <summary>
        /// 移除指定ID的数据记录
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        int DeleteEntities(params string[] ids);

        /// <summary>
        /// 移除指定预案的指定的标注数据记录
        /// </summary>
        /// <param name="planid">指定预案ID</param>
        /// <param name="ids">指定标识数据记录ID</param>
        /// <returns>返回受影响的总行数</returns>
        int DeletePlanMarks(int planid, params string[] ids);

        /// <summary>
        /// 移除指定预案的指定文档数据记录
        /// </summary>
        /// <param name="planid">指定预案ID</param>
        /// <param name="ids">指定文档数据记录ID</param>
        /// <returns>返回受影响的总行数</returns>
        int DeletePlanFiles(int planid, params string[] ids);
    }
}
