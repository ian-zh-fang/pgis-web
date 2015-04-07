using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{

    [System.Runtime.Serialization.DataContract(Name = "userrole", Namespace = "http://www.tiger.com/pgis/model/")]
    public class MUserRole
    {
        /// <summary>
        /// 主键标识
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "ID")]
        public int ID { get; set; }

        /// <summary>
        /// 角色ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "RoleID")]
        public int RoleID { get; set; }

        /// <summary>
        /// 用户ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "UserID")]
        public int UserID { get; set; }
    }
}
