﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Model
{
    public class TotalClass<T>
    {
        public int TotalRecords;
        public T Data;
    }

    /// <summary>
    /// 按照居住性质，统计人口模型
    /// </summary>
    public class Pop
    {
        public string Name { get; set; }

        public int Type { get; set; }

        public int Count { get; set; }
    }
}
