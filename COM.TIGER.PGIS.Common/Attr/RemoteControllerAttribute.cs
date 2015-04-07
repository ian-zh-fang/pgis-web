using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Common.Attr
{
    /// <summary>
    /// 标识访问远程服务器的指定的模块
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple=false, Inherited=false)]
    public sealed class RemoteControllerAttribute :Attribute
    {
        /// <summary>
        /// 控制器名称
        /// </summary>
        public string ControllerName { get; set; }

        /// <summary>
        /// 模块模型名称
        /// </summary>
        public string ModelName { get; set; }
    }
}
