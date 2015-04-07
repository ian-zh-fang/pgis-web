using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 单位标注
    /// </summary>
    public interface ICompanyMark
    {
        /// <summary>
        /// 添加新的单位标注数据记录
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        int InsertEntity(Model.MCompanyMark e);

        /// <summary>
        /// 分页所有的单位标注信息
        /// <para>获取指定页码的单位标注数据</para>
        /// </summary>
        /// <param name="index">需要指定的页码</param>
        /// <param name="size">每页条目数</param>
        /// <param name="type">筛选条件</param>
        /// <returns></returns>
        Model.TotalClass<List<Model.MCompanyMark>> PagingCompanyMarks(int index, int size, int type);

        /// <summary>
        /// 删除指定ID的单位标注数据记录
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        int DeleteEntities(params string[] ids);
    }
}
