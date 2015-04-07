using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "File", ModelName = "Files")]
    [System.Runtime.Serialization.DataContract(Name = "file", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MFile:IComparable<MFile>
    {
        /// <summary>
        /// 标识符
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 文件名称（算法加密后的文件名称）
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

        /// <summary>
        /// 文件别名（文件原名）
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Alias")]
        public string Alias { get; set; }

        /// <summary>
        /// 文件后缀
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Suffix")]
        public string Suffix { get; set; }

        /// <summary>
        /// 文件路径
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Path")]
        public string Path { get; set; }

        public int CompareTo(MFile other)
        {
            if (ID > other.ID) return 1;
            if (ID < other.ID) return -1;
            return 0;
        }
    }
}
