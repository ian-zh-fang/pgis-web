using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    [Common.Attr.RemoteController(ControllerName = "User", ModelName = "Users")]
    public class MUser
    {
        /// <summary>
        /// 主键标识
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// 用户编号
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 账户名称
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 账户密码
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// 真实姓名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 部门机构标识
        /// </summary>
        public int DepartmentID { get; set; }

        /// <summary>
        /// 性别
        /// <para>1标识男性;0标识女性</para>
        /// </summary>
        public int Gender { get; set; }

        /// <summary>
        /// 用户等级
        /// </summary>
        public int Lvl { get; set; }

        /// <summary>
        /// 启用/禁用标识.
        /// <para>1标识启用;0标识禁用</para>
        /// </summary>
        public int Disabled { get; set; }

        /// <summary>
        /// 确认密码
        /// </summary>
        public string CPassword { get { return Password; } }

        /// <summary>
        /// 组织机构信息
        /// </summary>
        public MDepartment Department { get; set; }

        /// <summary>
        /// 组织机构名称
        /// </summary>
        public string DepartmentName 
        {
            get { return Department == null ? null : Department.Name; }
        }

        /// <summary>
        /// 警员ID
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "OfficerID")]
        public int OfficerID { get; set; }

        /// <summary>
        /// 警员信息
        /// </summary>
        [System.Runtime.Serialization.DataMember(Name = "Officer")]
        public MOfficer Officer { get; set; }
    }
}
