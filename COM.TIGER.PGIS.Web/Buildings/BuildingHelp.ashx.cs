using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Buildings
{
    /// <summary>
    /// BuildingHelp 的摘要说明
    /// </summary>
    public class BuildingHelp :PageBase, IHttpHandler
    {
        /// <summary>
        /// 大楼信息数据处理程序
        /// </summary>
        [System.ComponentModel.Composition.Import(typeof(IFun.IBuilding))]
        private IFun.IBuilding _instance;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            { 
                case "pagebd":
                    //@ 分页大楼信息
                    PageBuildings();
                    break;
                case "addbd":
                    //@ 添加大楼热区信息
                    AddBuildingHot();
                    break;
                case "upbd":
                    //@ 变更大楼热区信息
                    UpdateBuildingHot();
                    break;
                case "delbd":
                    //@ 移除大楼热区信息
                    DeleteBuildingHot();
                    break;
                case "addpop":
                    AddPopulation();
                    break;
                case "uppop":
                    UpdatePopulation();
                    break;
                case "delpops":
                    DeletePopulations();
                    break;
                case "delpics":
                    DeletePics();
                    break;
                case "addunit":
                    AddUnit();
                    break;
                case "upunit":
                    UpdateUnit();
                    break;
                case "delunits":
                    DeleteUnits();
                    break;
                case "addroom":
                    AddRoom();
                    break;
                case "uproom":
                    UpdateRoom();
                    break;
                case "delrooms":
                    DeleteRooms();
                    break;
                case "addstructs":
                    AddStruct();
                    break;
                case "updstructs":
                    UpdateStruct();
                    break;
                case "delstructs":
                    DeleteStruct();
                    break;
                case "adduses":
                    AddUserType();
                    break;
                case "upduses":
                    UpdateUseType();
                    break;
                case "deluses":
                    DeleteUseType();
                    break;
                case "addprops":
                    AddProperty();
                    break;
                case "updprops":
                    UpdateProperty();
                    break;
                case "delprops":
                    DeleteProperty();
                    break;
                case "structs":
                    //@ 获取大楼结构信息。例如：土木，钢构，混泥土... 
                    GetBuildingTypes();
                    break;
                case "uses":
                    //@ 
                    GetRoomUses();
                    break;
                case "props":
                    //@  
                    GetRoomProperties();
                    break;
                case "units":
                    //@ 获取指定大楼的单元信息。例如：一单元，二单元，A座，B座，一号楼，二号楼...
                    GetUnitsOnBuildings();
                    break;
                case "rooms":
                    //@ 获取房间信息
                    GetRoomsOnUnits();
                    break;
                case "picts":
                    //@ 获取大楼照片信息
                    GetPictsOnBuilding();
                    break;
                case "companys":
                    //@ 获取指定房间的单位信息
                    GetCompneysOnRooms();
                    break;
                case "pops":
                    //@ 获取指定房间的人员信息
                    GetPopulationsOnRooms();
                    break;
                case "compsonhouse":
                    //@ 获取指定单元内的单位信息
                    GetCompneysOnHouse();
                    break;
                case "popsonhouse":
                    //@ 获取指定单元内的人员信息
                    GetPopulationsOnHouse();
                    break;
                case "poponbd":
                    //@ 获取指定大楼的人员信息
                    GetPopulationsOnBuilding();
                    break;
                case "comonbd":
                    //获取指定大楼的单位信息
                    GetCompneysOnBuilding();
                    break;
                case "upload":
                    GetUploadFiles();
                    break;
                case "sex":
                    GetGenders();
                    break;
                case "live":
                    GetLiveTypes();
                    break;
                case "edu":
                    GetEducations();
                    break;
                case "prov":
                    GetProvinces();
                    break;
                case "city":
                    GetCities();
                    break;
                case "poli":
                    GetPoliticalStatus();
                    break;
                case "blood":
                    GetBloodTypes();
                    break;
                case "soldier":
                    GetSoldierStatus();
                    break;
                case "marry":
                    GetMarriageStatus();
                    break;
                case "psych":
                    GetPsychosisTypes();
                    break;
                case "hrelation":
                    GetHRelation();
                    break;
                case "pophre":
                    GetPopulationHRelation();
                    break;
                case "popcom":
                    GetCompanyRecords();
                    break;
                case "poptemp":
                    GetTemporaryRecords();
                    break;
                case "popabroad":
                    GetAbroadRecords();
                    break;
                case "pagebdby":
                    //@ 查询指定名称和详细地址的大楼详细信息，分页并获取当前页码的大楼信息
                    PageBDOnNameAndAddr();
                    break;
                case "ttb":
                    //统计大楼人口和单位信息
                    TotalPopAndCom();
                    break;
                case "hrooms":
                    GetRoomsOnBuilding();
                    break;
                case "padd":
                    //@ 选择添加人员信息
                    PopuAdd();
                    break;
                case "comadd":
                    //@ 选择添加单位信息
                    CompanyAdd();
                    break;
                default:
                    break;
            }
        }

        private void CompanyAdd()
        {
            var addr = HttpContext.Current.Request["addr"];
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.CompanyAdd(addr, ids);
            ExecuteObj(data);
        }

        private void PopuAdd()
        {
            var addr = HttpContext.Current.Request["addr"];
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.PopuAdd(addr, ids);
            ExecuteObj(data);
        }

        private void GetCompneysOnBuilding()
        {
            var id = HttpContext.Current.Request["ids"];
            var data = _instance.GetCompneysOnBuilding(id);
            ExecuteSerialzor(data);
        }

        private void GetPopulationsOnBuilding()
        {
            var id = HttpContext.Current.Request["ids"];
            var data = _instance.GetPopulationsOnBuilding(id, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void GetRoomsOnBuilding()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.GetRoomsOnBuilding(id);
            ExecuteSerialzor(data);
        }

        private void TotalPopAndCom()
        {
            var ownerid = HttpContext.Current.Request["id"];
            var data = _instance.TotalPopAndCom(ownerid);
            ExecuteSerialzor(data);
        }

        private void PageBDOnNameAndAddr()
        {
            var name = HttpContext.Current.Request.QueryString["Name"];
            var addr = HttpContext.Current.Request.QueryString["Addr"];
            if (addr == "null")
                addr = null;

            var data = _instance.PageBuildingOnNameAndAddr(name, addr, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void GetPopulationHRelation()
        {
            var number = HttpContext.Current.Request["n"];
            var data = _instance.GetPopulationHRelation(number);
            ExecuteSerialzor(data);
        }

        private void GetAbroadRecords()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.GetAbroadRecords(id);
            ExecuteSerialzor(data);
        }

        private void GetTemporaryRecords()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.GetTemporaryRecords(id);
            ExecuteSerialzor(data);
        }

        private void GetCompanyRecords()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.GetCompanyRecords(id);
            ExecuteSerialzor(data);
        }

        private void GetHRelation()
        {
            var data = _instance.GetHRelation();
            ExecuteSerialzor(data);
        }

        private void DeletePopulations()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeletePopulations(ids);
            ExecuteObj(data);
        }

        private void UpdatePopulation()
        {
            var e = GetQueryParamsCollection<Model.MPopulationBasicInfoEx>();
            var data = _instance.UpdatePopulation(e);
            ExecuteObj(data);
        }

        private void AddPopulation()
        {
            var e = GetQueryParamsCollection<Model.MPopulationBasicInfoEx>();
            var data = _instance.AddPopulation(e);
            ExecuteObj(data);
        }

        private void GetGenders()
        {
            var data = _instance.GetGenders();
            ExecuteSerialzor(data);
        }

        private void GetLiveTypes()
        {
            var data = _instance.GetLiveTypes();
            ExecuteSerialzor(data);
        }

        private void GetEducations()
        {
            var data = _instance.GetEducations();
            ExecuteSerialzor(data);
        }

        private void GetProvinces()
        {
            var data = _instance.GetProvinces();
            ExecuteSerialzor(data);
        }

        private void GetCities()
        {
            var data = _instance.GetCities();
            ExecuteSerialzor(data);
        }

        private void GetPoliticalStatus()
        {
            var data = _instance.GetPoliticalStatus();
            ExecuteSerialzor(data);
        }

        private void GetBloodTypes()
        {
            var data = _instance.GetBloodTypes();
            ExecuteSerialzor(data);
        }

        private void GetSoldierStatus()
        {
            var data = _instance.GetSoldierStatus();
            ExecuteSerialzor(data);
        }

        private void GetMarriageStatus()
        {
            var data = _instance.GetMarriageStatus();
            ExecuteSerialzor(data);
        }

        private void GetPsychosisTypes()
        {
            var data = _instance.GetPsychosisTypes();
            ExecuteSerialzor(data);
        }

        private void DeletePics()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeletePics(ids);
            ExecuteObj(data);
        }

        private void GetUploadFiles()
        {
            var context = HttpContext.Current;
            var request = context.Request;
            var id = string.IsNullOrWhiteSpace(request["id"]) ? 0 : int.Parse(request["id"]);
            if (id == 0)
            {
                ExecuteObj(0, false, "没有确定大楼");
                return;
            }

            var rst = 0;
            for (var i = 0; i < request.Files.Count; i++)
            {
                HttpPostedFile file = request.Files[i];
                var fileinfo = SaveFile(file);
                var pic = new Model.MOwnerPic() { MOP_MOI_ID = id, MOP_ImgName = string.Format("{0}.{1}", fileinfo.Alias, fileinfo.Suffix), MOP_ImgRemark=fileinfo.Name, MOP_ImgTitle = fileinfo.Name, MOP_ImgPath = "0", MOP_Sort = 1, MOP_ImgDefault = 0, JID = "0" };
                rst += _instance.AddPic(pic);
            }

            ExecuteObj(rst, rst > 0, "文件上传失败");
        }

        private void AddRoom()
        {
            var e = GetQueryParamsCollection<Model.MRooms>();
            var data = _instance.AddRoom(e) ;
            ExecuteObj(data);
        }

        private void UpdateRoom()
        {
            var e = GetQueryParamsCollection<Model.MRooms>();
            var data = _instance.UpdateRoom(e);
            ExecuteObj(data);
        }

        private void DeleteRooms()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteRooms(ids);
            ExecuteObj(data);
        }

        private void AddUnit()
        {
            var e = GetQueryParamsCollection<Model.MUnitEx>();
            var data = _instance.AddUnit(e);
            ExecuteObj(data);
        }

        private void UpdateUnit()
        {
            var e = GetQueryParamsCollection<Model.MUnitEx>();
            var data = _instance.UpdateUnit(e);
            ExecuteObj(data);
        }

        private void DeleteUnits()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteUnits(ids);
            ExecuteObj(data);
        }

        private void AddStruct()
        {
            var e = GetQueryParamsCollection<Model.MParam>();
            var data = _instance.AddStruct(e) ;
            ExecuteObj(data);
        }

        private void UpdateStruct()
        {
            var e = GetQueryParamsCollection<Model.MParam>();
            var data = _instance.UpdateStruct(e);
            ExecuteObj(data);
        }

        private void DeleteStruct()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteStructs(ids);
            ExecuteObj(data);
        }

        private void AddUserType()
        {
            var e = GetQueryParamsCollection<Model.MParam>();
            var data = _instance.AddUseType(e);
            ExecuteObj(data);
        }

        private void UpdateUseType()
        {
            var e = GetQueryParamsCollection<Model.MParam>();
            var data = _instance.UpdateUseType(e);
            ExecuteObj(data);
        }

        private void DeleteUseType()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteUseTypes(ids);
            ExecuteObj(data);
        }

        private void AddProperty()
        {
            var e = GetQueryParamsCollection<Model.MParam>();
            var data = _instance.AddProperty(e);
            ExecuteObj(data);
        }

        private void UpdateProperty()
        {
            var e = GetQueryParamsCollection<Model.MParam>();
            var data = _instance.UpdateProperty(e);
            ExecuteObj(data);
        }

        private void DeleteProperty()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteProperties(ids);
            ExecuteObj(data);
        }

        private void GetRoomProperties()
        {
            var data = _instance.GetProperties();

            ExecuteSerialzor(data);
        }

        private void GetRoomUses()
        {
            var data = _instance.GetUseTypes() ;

            ExecuteSerialzor(data);
        }

        private void GetBuildingTypes()
        {
            var data = _instance.GetStructs();
            ExecuteSerialzor(data);
        }

        private void GetPictsOnBuilding()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.GetPics(id);
            ExecuteSerialzor(data);
        }

        //@ onpage
        private void GetPopulationsOnHouse()
        {
            var id = HttpContext.Current.Request["ids"];
            var data = _instance.GetPopulationsOnUnit(id, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        private void GetCompneysOnHouse()
        {
            var id = HttpContext.Current.Request["ids"];
            var data = _instance.GetCompneysOnUnit(id);
            
            ExecuteSerialzor(data);
        }

        private void GetPopulationsOnRooms()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.GetPopulationsOnRoom(ids);            
            ExecuteSerialzor(data);
        }

        private void GetCompneysOnRooms()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.GetCompanysOnRoom(ids);
            
            ExecuteSerialzor(data);
        }

        private void GetRoomsOnUnits()
        {
            var id = HttpContext.Current.Request["id"];
            var data = _instance.GetRoomsOnUnit(id);
            
            ExecuteSerialzor(data);
        }

        private void GetUnitsOnBuildings()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.GetUnitsOnBuilding(ids);
            
            ExecuteSerialzor(data);
        }

        private void AddBuildingHot()
        {
            var e = GetQueryParamsCollection<Model.MOwnerInfoEx>();
            var data = _instance.AddOwnerInfo(e);
            Execute(data);
        }

        private void UpdateBuildingHot()
        {
            var e = GetQueryParamsCollection<Model.MOwnerInfoEx>();
            var data = _instance.UpdateOwnerInfo(e);
            Execute(data);
        }

        private void DeleteBuildingHot()
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = _instance.DeleteOwnerInfos(ids);
            Execute(data);
        }

        private void PageBuildings()
        {
            var name = HttpContext.Current.Request["name"];
            var data = _instance.PageBuildings(name, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        public new bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}