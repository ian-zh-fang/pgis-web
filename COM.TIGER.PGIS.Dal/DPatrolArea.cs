using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DPatrolArea:DBase
    {

        public List<Model.MPatrolArea> GetPatrolArea()
        {
            return Post<List<Model.MPatrolArea>>("GetPatrolAreas", "PatrolArea").Result;
        }
    }
}
