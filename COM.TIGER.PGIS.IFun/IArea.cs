using COM.TIGER.PGIS.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 辖区管理
    /// </summary>
    public interface IArea
    {
        object[] All();

        TotalClass<List<MArea>> GetAreaForPage(string level, int p, int limit);

        /// <summary>
        /// 分页获取顶级区域信息
        /// </summary>
        /// <param name="index"></param>
        /// <param name="size"></param>
        /// <returns></returns>
        TotalClass<List<MArea>> PagingTopArea(int index, int size);

        /// <summary>
        /// 分页获取指定PID的区域信息
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="index"></param>
        /// <param name="size"></param>
        /// <returns></returns>
        TotalClass<List<MArea>> PagingChildArea(int pid, int index, int size);

        /// <summary>
        /// 获取树形结构的所有辖区信息集合
        /// </summary>
        /// <returns></returns>
        List<MArea> GetAreasTree();

        /// <summary>
        /// 添加新的记录信息
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns></returns>
        int InsertEntity<T>(T t);

        /// <summary>
        /// 更新指定的记录信息
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns></returns>
        int UpdateEntity<T>(T t);

        /// <summary>
        /// 批量移除指定ID的记录信息
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="ids"></param>
        /// <returns></returns>
        int DeleteEntities<T>(params string[] ids);

        /// <summary>
        /// 获取指定ID的 单位数据归属类型
        /// <para>如果传入的参数值为NULL，程序查询所有的数据记录信息</para>
        /// </summary>
        /// <param name="ids">需要查询的ID组</param>
        /// <returns></returns>
        List<Model.MBelongTo> GetBelongTos(params string[] ids);

        /// <summary>
        /// 分页获取 单位数据归属类型
        /// </summary>
        /// <param name="index">页码</param>
        /// <param name="size">每页条目数</param>
        /// <returns></returns>
        TotalClass<List<Model.MBelongTo>> PagingBelongTo(int index, int size);

        /// <summary>
        /// 获取指定区域ID的所有范围信息
        /// </summary>
        /// <param name="areaid"></param>
        /// <returns></returns>
        List<Model.MAreaRange> GetRanges(int areaid);
    }
}
