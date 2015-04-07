using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "Plan", ModelName = "Plans")]
    [System.Runtime.Serialization.DataContract(Name = "plan", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MPlan:MBase
    {
        /// <summary>
        /// 标识符
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 预案名称
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Name")]
        public string Name { get; set; }

        /// <summary>
        /// 预案描述信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Description")]
        public string Description { get; set; }

        private List<MTag> _tags = new List<MTag>();
        /// <summary>
        /// 预案标注信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Tags")]
        public MTag[] Tags
        {
            get
            {
                _tags.Sort();
                var items = new MTag[_tags.Count];
                _tags.CopyTo(items);
                return items;
            }
            set 
            {
                _tags.Clear();
                _tags.AddRange(value);
            }
        }

        private List<MFile> _files = new List<MFile>();
        /// <summary>
        /// 预案文件信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Files")]
        public MFile[] Files
        {
            get
            {
                _files.Sort();
                var items = new MFile[_files.Count];
                _files.CopyTo(items);
                return items;
            }
            set
            {
                _files.Clear();
                _files.AddRange(value);
            }
        }
    }

    /// <summary>
    /// 预案文件数据
    /// </summary>
    [Common.Attr.RemoteController(ControllerName = "Plan", ModelName = "PlanFiles")]
    [System.Runtime.Serialization.DataContract(Name = "planfile", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MPlanFile : MBase
    {
        /// <summary>
        /// 标识符
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 文档标识
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "FileID")]
        public int FileID { get; set; }

        /// <summary>
        /// 预案标识
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "PlanID")]
        public int PlanID { get; set; }
    }

    /// <summary>
    /// 预案在地图上的标注信息，
    /// <para>每一个预案都是有多个标注信息组成的</para>
    /// </summary>
    [Common.Attr.RemoteController(ControllerName = "Plan", ModelName = "PlanTags")]
    [System.Runtime.Serialization.DataContract(Name = "planmark", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MPlanMark : MBase
    {
        /// <summary>
        /// 标识符
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 标注标识
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "TagID")]
        public int TagID { get; set; }

        /// <summary>
        /// 预案标识
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "PlanID")]
        public int PlanID { get; set; }
    }
}
