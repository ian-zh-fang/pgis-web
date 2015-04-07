using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 标注
    /// </summary>
    public interface IMark
    {
        /// <summary>
        /// 获取指定ID的标注数据
        /// <para>如果没有指定ID，那么获取所有的标注数据</para>
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        List<Model.MMark> GetMarks(params string[] ids);

        /// <summary>
        /// 分页所有的标注信息
        /// <para>获取指定页码的标注数据</para>
        /// </summary>
        /// <param name="index">需要指定的页码</param>
        /// <param name="size">每页条目数</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MMark>> PagingMarks(int index, int size);

        /// <summary>
        /// 返回一个 Model.TotalClass&lt;List&lt;Model.MMark>> 类型的对象列表，它需要指定页码，和每页条目数
        /// </summary>
        /// <param name="index">当前页码</param>
        /// <param name="size">每页条目数</param>
        /// <param name="name">标注名称</param>
        /// <param name="typeid">标注类型</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MMark>> PagingMarks(int index, int size, string name, int typeid);

        /// <summary>
        /// 返回一个 Model.MarkType 类型的对象列表，每一个对象都包含对应的标注信息
        /// </summary>
        /// <returns></returns>
        List<Model.MMarkType> GetMarkTypeMarks();

        /// <summary>
        /// 添加新的标注数据记录
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        int InsertEntity(Model.MMark e);

        /// <summary>
        /// 更新指定的标注数据记录
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        int UpdateEntity(Model.MMark e);

        /// <summary>
        /// 删除指定ID的标注数据记录
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        int DeleteEntities(params string[] ids);

        /// <summary>
        /// 获取树形结构的所有标注信息集合
        /// </summary>
        /// <returns></returns>
        //List<Model.MMark> GetMarkRangeTree();

        /// <summary>
        /// 获取树形结构的所有标注信息集合
        /// </summary>
        /// <returns></returns>
        List<Model.MMarkEx> GetMarksTree();

        /// <summary>
        /// 返回一个 Model.MMarkType 类型的列表
        /// </summary>
        /// <param name="ids">需要获取的标注类型 ID 组值，以 “，” 分隔。如果不指定，获取所有的标注类型信息</param>
        /// <returns></returns>
        List<Model.MMarkType> GetMarkTypes(params string[] ids);

        /// <summary>
        /// 返回一个 Int32 类型的数据，标识添加新的标注类型信息成功或者失败。大于 0 标识成功；否则，表示失败
        /// </summary>
        /// <param name="e">需要添加的实体对象</param>
        /// <returns></returns>
        int InsertMarkType(Model.MMarkType e);

        /// <summary>
        /// 返回一个 Int32 类型的数据，标识变更指定的标注类型信息成功或者失败。大于 0 标识成功；否则，表示失败
        /// </summary>
        /// <param name="e">需要变更的实体对象</param>
        /// <returns></returns>
        int UpdateMarkType(Model.MMarkType e);

        /// <summary>
        /// 返回一个 Int32 类型的数据，标识移除指定的标注类型信息成功或者失败。大于 0 标识成功；否则，表示失败
        /// </summary>
        /// <param name="ids">需要移除的记录 ID 组值，以 “，” 分隔</param>
        /// <returns></returns>
        int DeleteMarkTypes(params string[] ids);
    }
}
