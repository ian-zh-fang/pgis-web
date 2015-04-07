using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Common.Attr
{
    /// <summary>
    /// 违停抓拍实体特性，标注当前特性的实例，不应该在XML文件中出现相应的属性或者节点
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = false)]
    public sealed class CaptureInfoAttribute : Attribute { }
}
