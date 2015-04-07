using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Params", ModelName = "Params")]
    public class MParam
    {
        private int? _pid = 0;
        private List<MParam> _params = null;

        /// <summary>
        /// 参数项ID
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// 父级参数项配置
        /// </summary>
        public int? PID
        {
            get { return _pid; }
            private set { _pid = value; }
        }

        /// <summary>
        /// 参数项名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 唯一编码
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 参数启用项
        /// <para>标识参数项启用项,TRUE表示启用当前参数项</para>
        /// </summary>
        public int Disabled { get; set; }
        public int Sort { get; set; }

        /// <summary>
        /// 子参数项信息
        /// <para>获取子参数信息的浅拷贝信息</para>
        /// </summary>
        public MParam[] ChildParams
        {
            get
            {
                //防止外部修改参数，此处返回对象的拷贝信息
                _params = _params ?? new List<MParam>();
                var arr = new MParam[_params.Count];
                _params.CopyTo(arr);
                return arr;
            }
        }
    }
}
