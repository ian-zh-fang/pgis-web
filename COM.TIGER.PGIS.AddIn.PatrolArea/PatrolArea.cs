using COM.TIGER.PGIS.Dal;
using COM.TIGER.PGIS.IFun;
using COM.TIGER.PGIS.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.PatrolArea
{
    [System.ComponentModel.Composition.Export(typeof(IPatrolArea))]
    public class PatrolArea : IPatrolArea
    {
        private DPatrolArea _PatrolArea = new DPatrolArea();

        public List<COM.TIGER.PGIS.Model.MPatrolArea> GetPatrolArea()
        {
            return _PatrolArea.GetPatrolArea();
        }




        public int DeleteEntities<T>(params string[] ids)
        {
            return _PatrolArea.DeleteEntities<T>(ids);
        }


        public int UpdateEntity<T>(T t)
        {
            return _PatrolArea.UpdateEntity<T>(t);
        }

        public int InsertEntity<T>(T t)
        {
            return _PatrolArea.AddEntity<T>(t);
        }


        public TotalClass<List<MPatrolArea>> Page(int index, int size)
        {
            return _PatrolArea.PagingEntities<Model.MPatrolArea>(index, size);
        }
    }
}
