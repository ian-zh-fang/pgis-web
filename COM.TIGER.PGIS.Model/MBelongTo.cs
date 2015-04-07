using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "BelongTo", ModelName = "BelongTos")]
    public class MBelongTo
    {
        /// <summary>
        /// 主键标识
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// 数据归属地类型代码
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 数据归属地类型名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 数据归属地类型说明
        /// </summary>
        public string Description { get; set; }
    }
}
