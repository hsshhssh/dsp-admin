<template>
  <div class="app-container">
    <el-form ref="postForm" :model="temp" :rules="rules" label-position="right" label-width="120px">
      <el-form-item label="计划名称">
        <el-input v-model="temp.name"/>
      </el-form-item>
      <el-form-item label="广告位名称">
        <el-button type="primary" @click="handleSelectAd">选择广告位</el-button>
        <el-input v-model="temp.adplacementname" :disabled="true"/>
      </el-form-item>
      <el-form-item label="素材名称">
        <el-select v-model="temp.materialid" filterable placeholder="请选择" style="width: 200px">
          <el-option
            v-for="item in materialOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="曝光监测URL">
        <el-input v-model="temp.pmoUrl" />
      </el-form-item>
      <el-form-item label="点击监测URL">
        <el-input v-model="temp.cmoUrl" />
      </el-form-item>

      <el-form-item label="投放时间">
        <el-checkbox-group v-model="temp.hoursList">
          <el-checkbox label="1">01</el-checkbox>
          <el-checkbox label="2">02</el-checkbox>
          <el-checkbox label="3">03</el-checkbox>
          <el-checkbox label="4">04</el-checkbox>
          <el-checkbox label="5">05</el-checkbox>
          <el-checkbox label="6">06</el-checkbox>
          <el-checkbox label="7">07</el-checkbox>
          <el-checkbox label="8">08</el-checkbox>
          <el-checkbox label="9">09</el-checkbox>
          <el-checkbox label="10">10</el-checkbox>
          <el-checkbox label="11">11</el-checkbox>
          <el-checkbox label="12">12</el-checkbox>
          <el-checkbox label="13">13</el-checkbox>
          <el-checkbox label="14">14</el-checkbox>
          <el-checkbox label="15">15</el-checkbox>
          <el-checkbox label="16">16</el-checkbox>
          <el-checkbox label="17">17</el-checkbox>
          <el-checkbox label="18">18</el-checkbox>
          <el-checkbox label="19">19</el-checkbox>
          <el-checkbox label="20">20</el-checkbox>
          <el-checkbox label="21">21</el-checkbox>
          <el-checkbox label="22">22</el-checkbox>
          <el-checkbox label="23">23</el-checkbox>
          <el-checkbox label="24">24</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="投放地区">
        <el-select v-model="temp.cityList" multiple filterable placeholder="请选择" style="width: 500px">
          <el-option
            v-for="item in cityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="网络状态">
        <el-checkbox-group v-model="temp.networkList">
          <el-checkbox label="0">无</el-checkbox>
          <el-checkbox label="1">WIFI</el-checkbox>
          <el-checkbox label="2">2/3/4G</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="自定义人群">
        <el-select v-model="temp.tagList" multiple filterable placeholder="请选择" style="width: 500px">
          <el-option
            v-for="item in tagOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="temp.materialname" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>


    <el-dialog title="选择广告位" :visible.sync="dialogSelectVisible">
      <div class="filter-container" style="margin-bottom: 20px">
        <el-input placeholder="广告位名称" v-model="adListQuery.adplacementname_like" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>

      <el-table
        v-loading="adListLoading"
        :key="adTableKey"
        :data="adList"
        border
        fit
        highlight-current-row
        style="width: 100%;">

        <el-table-column label="平台媒体" prop="id" sortable="custom" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.pmediaStr }}</span>
          </template>
        </el-table-column>

        <el-table-column label="广告位ID" prop="id" sortable="custom" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.adplacementid }}</span>
          </template>
        </el-table-column>

        <el-table-column label="广告位名称" prop="id" sortable="custom" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.adplacementname }}</span>
          </template>
        </el-table-column>

        <el-table-column label="媒体名称" prop="id" sortable="custom" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.medianame }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleSelectAdConfirm(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="adTotal>0" :total="adTotal" :page.sync="adListQuery.page" :limit.sync="adListQuery.limit" @pagination="getAdList" />
    </el-dialog>

  </div>
</template>

<script>
  import { getStrategy, saveStrategy } from '@/api/dsp/strategy'
  import { fetchListTag } from '@/api/dsp/tag'
  import { fetchListMaterial } from '@/api/dsp/material'
  import { fetchListAdplacement } from '@/api/dsp/adplacement'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {

    },
    data() {
      return {
        adTableKey: 0,
        adList:[],
        adListQuery: {
          limit: 5
        },
        adListLoading: false,
        adTotal: 5,
        dialogSelectVisible: false,
        cityOptions: [
          { value:"110000", label:"北京市"},
          { value:"120000", label:"天津市"},
          { value:"130100", label:"石家庄市"},
          { value:"130181", label:"辛集市"},
          { value:"130183", label:"晋州市"},
          { value:"130184", label:"新乐市"},
          { value:"130200", label:"唐山市"},
          { value:"130284", label:"滦州市"},
          { value:"130281", label:"遵化市"},
          { value:"130283", label:"迁安市"},
          { value:"130300", label:"秦皇岛市"},
          { value:"130400", label:"邯郸市"},
          { value:"130481", label:"武安市"},
          { value:"130500", label:"邢台市"},
          { value:"130581", label:"南宫市"},
          { value:"130582", label:"沙河市"},
          { value:"130600", label:"保定市"},
          { value:"130681", label:"涿州市"},
          { value:"130682", label:"定州市"},
          { value:"130683", label:"安国市"},
          { value:"130684", label:"高碑店市"},
          { value:"130700", label:"张家口市"},
          { value:"130800", label:"承德市"},
          { value:"130881", label:"平泉市"},
          { value:"130900", label:"沧州市"},
          { value:"130981", label:"泊头市"},
          { value:"130982", label:"任丘市"},
          { value:"130983", label:"黄骅市"},
          { value:"130984", label:"河间市"},
          { value:"131000", label:"廊坊市"},
          { value:"131081", label:"霸州市"},
          { value:"131082", label:"三河市"},
          { value:"131100", label:"衡水市"},
          { value:"131182", label:"深州市"},
          { value:"140100", label:"太原市"},
          { value:"140181", label:"古交市"},
          { value:"140200", label:"大同市"},
          { value:"140300", label:"阳泉市"},
          { value:"140400", label:"长治市"},
          { value:"140500", label:"晋城市"},
          { value:"140581", label:"高平市"},
          { value:"140600", label:"朔州市"},
          { value:"140681", label:"怀仁市"},
          { value:"140700", label:"晋中市"},
          { value:"140781", label:"介休市"},
          { value:"140800", label:"运城市"},
          { value:"140881", label:"永济市"},
          { value:"140882", label:"河津市"},
          { value:"140900", label:"忻州市"},
          { value:"140981", label:"原平市"},
          { value:"141000", label:"临汾市"},
          { value:"141081", label:"侯马市"},
          { value:"141082", label:"霍州市"},
          { value:"141100", label:"吕梁市"},
          { value:"141181", label:"孝义市"},
          { value:"141182", label:"汾阳市"},
          { value:"150100", label:"呼和浩特市"},
          { value:"150200", label:"包头市"},
          { value:"150300", label:"乌海市"},
          { value:"150400", label:"赤峰市"},
          { value:"150500", label:"通辽市"},
          { value:"150581", label:"霍林郭勒市"},
          { value:"150600", label:"鄂尔多斯市"},
          { value:"150700", label:"呼伦贝尔市"},
          { value:"150781", label:"满洲里市"},
          { value:"150782", label:"牙克石市"},
          { value:"150783", label:"扎兰屯市"},
          { value:"150784", label:"额尔古纳市"},
          { value:"150785", label:"根河市"},
          { value:"150800", label:"巴彦淖尔市"},
          { value:"150900", label:"乌兰察布市"},
          { value:"150981", label:"丰镇市"},
          { value:"152201", label:"乌兰浩特市"},
          { value:"152202", label:"阿尔山市"},
          { value:"152501", label:"二连浩特市"},
          { value:"152502", label:"锡林浩特市"},
          { value:"210100", label:"沈阳市"},
          { value:"210181", label:"新民市"},
          { value:"210200", label:"大连市"},
          { value:"210281", label:"瓦房店市"},
          { value:"210283", label:"庄河市"},
          { value:"210300", label:"鞍山市"},
          { value:"210381", label:"海城市"},
          { value:"210400", label:"抚顺市"},
          { value:"210500", label:"本溪市"},
          { value:"210600", label:"丹东市"},
          { value:"210681", label:"东港市"},
          { value:"210682", label:"凤城市"},
          { value:"210700", label:"锦州市"},
          { value:"210781", label:"凌海市"},
          { value:"210782", label:"北镇市"},
          { value:"210800", label:"营口市"},
          { value:"210881", label:"盖州市"},
          { value:"210882", label:"大石桥市"},
          { value:"210900", label:"阜新市"},
          { value:"211000", label:"辽阳市"},
          { value:"211081", label:"灯塔市"},
          { value:"211100", label:"盘锦市"},
          { value:"211200", label:"铁岭市"},
          { value:"211281", label:"调兵山市"},
          { value:"211282", label:"开原市"},
          { value:"211300", label:"朝阳市"},
          { value:"211381", label:"北票市"},
          { value:"211382", label:"凌源市"},
          { value:"211400", label:"葫芦岛市"},
          { value:"211481", label:"兴城市"},
          { value:"220100", label:"长春市"},
          { value:"220182", label:"榆树市"},
          { value:"220183", label:"德惠市"},
          { value:"220200", label:"吉林市"},
          { value:"220281", label:"蛟河市"},
          { value:"220282", label:"桦甸市"},
          { value:"220283", label:"舒兰市"},
          { value:"220284", label:"磐石市"},
          { value:"220300", label:"四平市"},
          { value:"220381", label:"公主岭市"},
          { value:"220382", label:"双辽市"},
          { value:"220400", label:"辽源市"},
          { value:"220500", label:"通化市"},
          { value:"220581", label:"梅河口市"},
          { value:"220582", label:"集安市"},
          { value:"220600", label:"白山市"},
          { value:"220681", label:"临江市"},
          { value:"220700", label:"松原市"},
          { value:"220781", label:"扶余市"},
          { value:"220800", label:"白城市"},
          { value:"220881", label:"洮南市"},
          { value:"220882", label:"大安市"},
          { value:"222401", label:"延吉市"},
          { value:"222402", label:"图们市"},
          { value:"222403", label:"敦化市"},
          { value:"222404", label:"珲春市"},
          { value:"222405", label:"龙井市"},
          { value:"222406", label:"和龙市"},
          { value:"230100", label:"哈尔滨市"},
          { value:"230183", label:"尚志市"},
          { value:"230184", label:"五常市"},
          { value:"230200", label:"齐齐哈尔市"},
          { value:"230281", label:"讷河市"},
          { value:"230300", label:"鸡西市"},
          { value:"230381", label:"虎林市"},
          { value:"230382", label:"密山市"},
          { value:"230400", label:"鹤岗市"},
          { value:"230500", label:"双鸭山市"},
          { value:"230600", label:"大庆市"},
          { value:"230700", label:"伊春市"},
          { value:"230781", label:"铁力市"},
          { value:"230800", label:"佳木斯市"},
          { value:"230881", label:"同江市"},
          { value:"230882", label:"富锦市"},
          { value:"230883", label:"抚远市"},
          { value:"230900", label:"七台河市"},
          { value:"231000", label:"牡丹江市"},
          { value:"231081", label:"绥芬河市"},
          { value:"231083", label:"海林市"},
          { value:"231084", label:"宁安市"},
          { value:"231085", label:"穆棱市"},
          { value:"231086", label:"东宁市"},
          { value:"231100", label:"黑河市"},
          { value:"231181", label:"北安市"},
          { value:"231182", label:"五大连池市"},
          { value:"231200", label:"绥化市"},
          { value:"231281", label:"安达市"},
          { value:"231282", label:"肇东市"},
          { value:"231283", label:"海伦市"},
          { value:"232701", label:"漠河市"},
          { value:"310000", label:"上海市"},
          { value:"320100", label:"南京市"},
          { value:"320200", label:"无锡市"},
          { value:"320281", label:"江阴市"},
          { value:"320282", label:"宜兴市"},
          { value:"320300", label:"徐州市"},
          { value:"320381", label:"新沂市"},
          { value:"320382", label:"邳州市"},
          { value:"320400", label:"常州市"},
          { value:"320481", label:"溧阳市"},
          { value:"320500", label:"苏州市"},
          { value:"320581", label:"常熟市"},
          { value:"320582", label:"张家港市"},
          { value:"320583", label:"昆山市"},
          { value:"320585", label:"太仓市"},
          { value:"320600", label:"南通市"},
          { value:"320685", label:"海安市"},
          { value:"320681", label:"启东市"},
          { value:"320682", label:"如皋市"},
          { value:"320684", label:"海门市"},
          { value:"320700", label:"连云港市"},
          { value:"320800", label:"淮安市"},
          { value:"320900", label:"盐城市"},
          { value:"320981", label:"东台市"},
          { value:"321000", label:"扬州市"},
          { value:"321081", label:"仪征市"},
          { value:"321084", label:"高邮市"},
          { value:"321100", label:"镇江市"},
          { value:"321181", label:"丹阳市"},
          { value:"321182", label:"扬中市"},
          { value:"321183", label:"句容市"},
          { value:"321200", label:"泰州市"},
          { value:"321281", label:"兴化市"},
          { value:"321282", label:"靖江市"},
          { value:"321283", label:"泰兴市"},
          { value:"321300", label:"宿迁市"},
          { value:"330100", label:"杭州市"},
          { value:"330182", label:"建德市"},
          { value:"330200", label:"宁波市"},
          { value:"330281", label:"余姚市"},
          { value:"330282", label:"慈溪市"},
          { value:"330300", label:"温州市"},
          { value:"330381", label:"瑞安市"},
          { value:"330382", label:"乐清市"},
          { value:"330400", label:"嘉兴市"},
          { value:"330481", label:"海宁市"},
          { value:"330482", label:"平湖市"},
          { value:"330483", label:"桐乡市"},
          { value:"330500", label:"湖州市"},
          { value:"330600", label:"绍兴市"},
          { value:"330681", label:"诸暨市"},
          { value:"330683", label:"嵊州市"},
          { value:"330700", label:"金华市"},
          { value:"330781", label:"兰溪市"},
          { value:"330782", label:"义乌市"},
          { value:"330783", label:"东阳市"},
          { value:"330784", label:"永康市"},
          { value:"330800", label:"衢州市"},
          { value:"330881", label:"江山市"},
          { value:"330900", label:"舟山市"},
          { value:"331000", label:"台州市"},
          { value:"331081", label:"温岭市"},
          { value:"331082", label:"临海市"},
          { value:"331083", label:"玉环市"},
          { value:"331100", label:"丽水市"},
          { value:"331181", label:"龙泉市"},
          { value:"340100", label:"合肥市"},
          { value:"340181", label:"巢湖市"},
          { value:"340200", label:"芜湖市"},
          { value:"340300", label:"蚌埠市"},
          { value:"340400", label:"淮南市"},
          { value:"340500", label:"马鞍山市"},
          { value:"340600", label:"淮北市"},
          { value:"340700", label:"铜陵市"},
          { value:"340800", label:"安庆市"},
          { value:"340882", label:"潜山市"},
          { value:"340881", label:"桐城市"},
          { value:"341000", label:"黄山市"},
          { value:"341100", label:"滁州市"},
          { value:"341181", label:"天长市"},
          { value:"341182", label:"明光市"},
          { value:"341200", label:"阜阳市"},
          { value:"341282", label:"界首市"},
          { value:"341300", label:"宿州市"},
          { value:"341500", label:"六安市"},
          { value:"341600", label:"亳州市"},
          { value:"341700", label:"池州市"},
          { value:"341800", label:"宣城市"},
          { value:"341881", label:"宁国市"},
          { value:"350100", label:"福州市"},
          { value:"350181", label:"福清市"},
          { value:"350200", label:"厦门市"},
          { value:"350300", label:"莆田市"},
          { value:"350400", label:"三明市"},
          { value:"350481", label:"永安市"},
          { value:"350500", label:"泉州市"},
          { value:"350581", label:"石狮市"},
          { value:"350582", label:"晋江市"},
          { value:"350583", label:"南安市"},
          { value:"350600", label:"漳州市"},
          { value:"350681", label:"龙海市"},
          { value:"350700", label:"南平市"},
          { value:"350781", label:"邵武市"},
          { value:"350782", label:"武夷山市"},
          { value:"350783", label:"建瓯市"},
          { value:"350800", label:"龙岩市"},
          { value:"350881", label:"漳平市"},
          { value:"350900", label:"宁德市"},
          { value:"350981", label:"福安市"},
          { value:"350982", label:"福鼎市"},
          { value:"360100", label:"南昌市"},
          { value:"360200", label:"景德镇市"},
          { value:"360281", label:"乐平市"},
          { value:"360300", label:"萍乡市"},
          { value:"360400", label:"九江市"},
          { value:"360481", label:"瑞昌市"},
          { value:"360482", label:"共青城市"},
          { value:"360483", label:"庐山市"},
          { value:"360500", label:"新余市"},
          { value:"360600", label:"鹰潭市"},
          { value:"360681", label:"贵溪市"},
          { value:"360700", label:"赣州市"},
          { value:"360781", label:"瑞金市"},
          { value:"360800", label:"吉安市"},
          { value:"360881", label:"井冈山市"},
          { value:"360900", label:"宜春市"},
          { value:"360981", label:"丰城市"},
          { value:"360982", label:"樟树市"},
          { value:"360983", label:"高安市"},
          { value:"361000", label:"抚州市"},
          { value:"361100", label:"上饶市"},
          { value:"361181", label:"德兴市"},
          { value:"370100", label:"济南市"},
          { value:"370200", label:"青岛市"},
          { value:"370281", label:"胶州市"},
          { value:"370283", label:"平度市"},
          { value:"370285", label:"莱西市"},
          { value:"370300", label:"淄博市"},
          { value:"370400", label:"枣庄市"},
          { value:"370481", label:"滕州市"},
          { value:"370500", label:"东营市"},
          { value:"370600", label:"烟台市"},
          { value:"370681", label:"龙口市"},
          { value:"370682", label:"莱阳市"},
          { value:"370683", label:"莱州市"},
          { value:"370684", label:"蓬莱市"},
          { value:"370685", label:"招远市"},
          { value:"370686", label:"栖霞市"},
          { value:"370687", label:"海阳市"},
          { value:"370700", label:"潍坊市"},
          { value:"370781", label:"青州市"},
          { value:"370782", label:"诸城市"},
          { value:"370783", label:"寿光市"},
          { value:"370784", label:"安丘市"},
          { value:"370785", label:"高密市"},
          { value:"370786", label:"昌邑市"},
          { value:"370800", label:"济宁市"},
          { value:"370881", label:"曲阜市"},
          { value:"370883", label:"邹城市"},
          { value:"370900", label:"泰安市"},
          { value:"370982", label:"新泰市"},
          { value:"370983", label:"肥城市"},
          { value:"371000", label:"威海市"},
          { value:"371082", label:"荣成市"},
          { value:"371083", label:"乳山市"},
          { value:"371100", label:"日照市"},
          { value:"371300", label:"临沂市"},
          { value:"371400", label:"德州市"},
          { value:"371481", label:"乐陵市"},
          { value:"371482", label:"禹城市"},
          { value:"371500", label:"聊城市"},
          { value:"371581", label:"临清市"},
          { value:"371600", label:"滨州市"},
          { value:"371681", label:"邹平市"},
          { value:"371700", label:"菏泽市"},
          { value:"410100", label:"郑州市"},
          { value:"410181", label:"巩义市"},
          { value:"410182", label:"荥阳市"},
          { value:"410183", label:"新密市"},
          { value:"410184", label:"新郑市"},
          { value:"410185", label:"登封市"},
          { value:"410200", label:"开封市"},
          { value:"410300", label:"洛阳市"},
          { value:"410381", label:"偃师市"},
          { value:"410400", label:"平顶山市"},
          { value:"410481", label:"舞钢市"},
          { value:"410482", label:"汝州市"},
          { value:"410500", label:"安阳市"},
          { value:"410581", label:"林州市"},
          { value:"410600", label:"鹤壁市"},
          { value:"410700", label:"新乡市"},
          { value:"410781", label:"卫辉市"},
          { value:"410782", label:"辉县市"},
          { value:"410800", label:"焦作市"},
          { value:"410882", label:"沁阳市"},
          { value:"410883", label:"孟州市"},
          { value:"410900", label:"濮阳市"},
          { value:"411000", label:"许昌市"},
          { value:"411081", label:"禹州市"},
          { value:"411082", label:"长葛市"},
          { value:"411100", label:"漯河市"},
          { value:"411200", label:"三门峡市"},
          { value:"411281", label:"义马市"},
          { value:"411282", label:"灵宝市"},
          { value:"411300", label:"南阳市"},
          { value:"411381", label:"邓州市"},
          { value:"411400", label:"商丘市"},
          { value:"411481", label:"永城市"},
          { value:"411500", label:"信阳市"},
          { value:"411600", label:"周口市"},
          { value:"411681", label:"项城市"},
          { value:"411700", label:"驻马店市"},
          { value:"419001", label:"济源市"},
          { value:"420100", label:"武汉市"},
          { value:"420200", label:"黄石市"},
          { value:"420281", label:"大冶市"},
          { value:"420300", label:"十堰市"},
          { value:"420381", label:"丹江口市"},
          { value:"420500", label:"宜昌市"},
          { value:"420581", label:"宜都市"},
          { value:"420582", label:"当阳市"},
          { value:"420583", label:"枝江市"},
          { value:"420600", label:"襄阳市"},
          { value:"420682", label:"老河口市"},
          { value:"420683", label:"枣阳市"},
          { value:"420684", label:"宜城市"},
          { value:"420700", label:"鄂州市"},
          { value:"420800", label:"荆门市"},
          { value:"420882", label:"京山市"},
          { value:"420881", label:"钟祥市"},
          { value:"420900", label:"孝感市"},
          { value:"420981", label:"应城市"},
          { value:"420982", label:"安陆市"},
          { value:"420984", label:"汉川市"},
          { value:"421000", label:"荆州市"},
          { value:"421081", label:"石首市"},
          { value:"421083", label:"洪湖市"},
          { value:"421087", label:"松滋市"},
          { value:"421100", label:"黄冈市"},
          { value:"421181", label:"麻城市"},
          { value:"421182", label:"武穴市"},
          { value:"421200", label:"咸宁市"},
          { value:"421281", label:"赤壁市"},
          { value:"421300", label:"随州市"},
          { value:"421381", label:"广水市"},
          { value:"422801", label:"恩施市"},
          { value:"422802", label:"利川市"},
          { value:"429004", label:"仙桃市"},
          { value:"429005", label:"潜江市"},
          { value:"429006", label:"天门市"},
          { value:"430100", label:"长沙市"},
          { value:"430181", label:"浏阳市"},
          { value:"430182", label:"宁乡市"},
          { value:"430200", label:"株洲市"},
          { value:"430281", label:"醴陵市"},
          { value:"430300", label:"湘潭市"},
          { value:"430381", label:"湘乡市"},
          { value:"430382", label:"韶山市"},
          { value:"430400", label:"衡阳市"},
          { value:"430481", label:"耒阳市"},
          { value:"430482", label:"常宁市"},
          { value:"430500", label:"邵阳市"},
          { value:"430581", label:"武冈市"},
          { value:"430600", label:"岳阳市"},
          { value:"430681", label:"汨罗市"},
          { value:"430682", label:"临湘市"},
          { value:"430700", label:"常德市"},
          { value:"430781", label:"津市市"},
          { value:"430800", label:"张家界市"},
          { value:"430900", label:"益阳市"},
          { value:"430981", label:"沅江市"},
          { value:"431000", label:"郴州市"},
          { value:"431081", label:"资兴市"},
          { value:"431100", label:"永州市"},
          { value:"431200", label:"怀化市"},
          { value:"431281", label:"洪江市"},
          { value:"431300", label:"娄底市"},
          { value:"431381", label:"冷水江市"},
          { value:"431382", label:"涟源市"},
          { value:"433101", label:"吉首市"},
          { value:"440100", label:"广州市"},
          { value:"440200", label:"韶关市"},
          { value:"440281", label:"乐昌市"},
          { value:"440282", label:"南雄市"},
          { value:"440300", label:"深圳市"},
          { value:"440400", label:"珠海市"},
          { value:"440500", label:"汕头市"},
          { value:"440600", label:"佛山市"},
          { value:"440700", label:"江门市"},
          { value:"440781", label:"台山市"},
          { value:"440783", label:"开平市"},
          { value:"440784", label:"鹤山市"},
          { value:"440785", label:"恩平市"},
          { value:"440800", label:"湛江市"},
          { value:"440881", label:"廉江市"},
          { value:"440882", label:"雷州市"},
          { value:"440883", label:"吴川市"},
          { value:"440900", label:"茂名市"},
          { value:"440981", label:"高州市"},
          { value:"440982", label:"化州市"},
          { value:"440983", label:"信宜市"},
          { value:"441200", label:"肇庆市"},
          { value:"441284", label:"四会市"},
          { value:"441300", label:"惠州市"},
          { value:"441400", label:"梅州市"},
          { value:"441481", label:"兴宁市"},
          { value:"441500", label:"汕尾市"},
          { value:"441581", label:"陆丰市"},
          { value:"441600", label:"河源市"},
          { value:"441700", label:"阳江市"},
          { value:"441781", label:"阳春市"},
          { value:"441800", label:"清远市"},
          { value:"441881", label:"英德市"},
          { value:"441882", label:"连州市"},
          { value:"441900", label:"东莞市"},
          { value:"442000", label:"中山市"},
          { value:"445100", label:"潮州市"},
          { value:"445200", label:"揭阳市"},
          { value:"445281", label:"普宁市"},
          { value:"445300", label:"云浮市"},
          { value:"445381", label:"罗定市"},
          { value:"450100", label:"南宁市"},
          { value:"450200", label:"柳州市"},
          { value:"450300", label:"桂林市"},
          { value:"450381", label:"荔浦市"},
          { value:"450400", label:"梧州市"},
          { value:"450481", label:"岑溪市"},
          { value:"450500", label:"北海市"},
          { value:"450600", label:"防城港市"},
          { value:"450681", label:"东兴市"},
          { value:"450700", label:"钦州市"},
          { value:"450800", label:"贵港市"},
          { value:"450881", label:"桂平市"},
          { value:"450900", label:"玉林市"},
          { value:"450981", label:"北流市"},
          { value:"451000", label:"百色市"},
          { value:"451081", label:"靖西市"},
          { value:"451100", label:"贺州市"},
          { value:"451200", label:"河池市"},
          { value:"451300", label:"来宾市"},
          { value:"451381", label:"合山市"},
          { value:"451400", label:"崇左市"},
          { value:"451481", label:"凭祥市"},
          { value:"460100", label:"海口市"},
          { value:"460200", label:"三亚市"},
          { value:"460300", label:"三沙市"},
          { value:"460400", label:"儋州市"},
          { value:"469001", label:"五指山市"},
          { value:"469002", label:"琼海市"},
          { value:"469005", label:"文昌市"},
          { value:"469006", label:"万宁市"},
          { value:"469007", label:"东方市"},
          { value:"500000", label:"重庆市"},
          { value:"510100", label:"成都市"},
          { value:"510181", label:"都江堰市"},
          { value:"510182", label:"彭州市"},
          { value:"510183", label:"邛崃市"},
          { value:"510184", label:"崇州市"},
          { value:"510185", label:"简阳市"},
          { value:"510300", label:"自贡市"},
          { value:"510400", label:"攀枝花市"},
          { value:"510500", label:"泸州市"},
          { value:"510600", label:"德阳市"},
          { value:"510681", label:"广汉市"},
          { value:"510682", label:"什邡市"},
          { value:"510683", label:"绵竹市"},
          { value:"510700", label:"绵阳市"},
          { value:"510781", label:"江油市"},
          { value:"510800", label:"广元市"},
          { value:"510900", label:"遂宁市"},
          { value:"511000", label:"内江市"},
          { value:"511083", label:"隆昌市"},
          { value:"511100", label:"乐山市"},
          { value:"511181", label:"峨眉山市"},
          { value:"511300", label:"南充市"},
          { value:"511381", label:"阆中市"},
          { value:"511400", label:"眉山市"},
          { value:"511500", label:"宜宾市"},
          { value:"511600", label:"广安市"},
          { value:"511681", label:"华蓥市"},
          { value:"511700", label:"达州市"},
          { value:"511781", label:"万源市"},
          { value:"511800", label:"雅安市"},
          { value:"511900", label:"巴中市"},
          { value:"512000", label:"资阳市"},
          { value:"513201", label:"马尔康市"},
          { value:"513301", label:"康定市"},
          { value:"513401", label:"西昌市"},
          { value:"520100", label:"贵阳市"},
          { value:"520181", label:"清镇市"},
          { value:"520200", label:"六盘水市"},
          { value:"520281", label:"盘州市"},
          { value:"520300", label:"遵义市"},
          { value:"520381", label:"赤水市"},
          { value:"520382", label:"仁怀市"},
          { value:"520400", label:"安顺市"},
          { value:"520500", label:"毕节市"},
          { value:"520600", label:"铜仁市"},
          { value:"522301", label:"兴义市"},
          { value:"522302", label:"兴仁市"},
          { value:"522601", label:"凯里市"},
          { value:"522701", label:"都匀市"},
          { value:"522702", label:"福泉市"},
          { value:"530100", label:"昆明市"},
          { value:"530181", label:"安宁市"},
          { value:"530300", label:"曲靖市"},
          { value:"530381", label:"宣威市"},
          { value:"530400", label:"玉溪市"},
          { value:"530500", label:"保山市"},
          { value:"530581", label:"腾冲市"},
          { value:"530600", label:"昭通市"},
          { value:"530681", label:"水富市"},
          { value:"530700", label:"丽江市"},
          { value:"530800", label:"普洱市"},
          { value:"530900", label:"临沧市"},
          { value:"532301", label:"楚雄市"},
          { value:"532501", label:"个旧市"},
          { value:"532502", label:"开远市"},
          { value:"532503", label:"蒙自市"},
          { value:"532504", label:"弥勒市"},
          { value:"532601", label:"文山市"},
          { value:"532801", label:"景洪市"},
          { value:"532901", label:"大理市"},
          { value:"533102", label:"瑞丽市"},
          { value:"533103", label:"芒市"},
          { value:"533301", label:"泸水市"},
          { value:"533401", label:"香格里拉市"},
          { value:"540100", label:"拉萨市"},
          { value:"540200", label:"日喀则市"},
          { value:"540300", label:"昌都市"},
          { value:"540400", label:"林芝市"},
          { value:"540500", label:"山南市"},
          { value:"540600", label:"那曲市"},
          { value:"610100", label:"西安市"},
          { value:"610200", label:"铜川市"},
          { value:"610300", label:"宝鸡市"},
          { value:"610400", label:"咸阳市"},
          { value:"610482", label:"彬州市"},
          { value:"610481", label:"兴平市"},
          { value:"610500", label:"渭南市"},
          { value:"610581", label:"韩城市"},
          { value:"610582", label:"华阴市"},
          { value:"610600", label:"延安市"},
          { value:"610700", label:"汉中市"},
          { value:"610800", label:"榆林市"},
          { value:"610881", label:"神木市"},
          { value:"610900", label:"安康市"},
          { value:"611000", label:"商洛市"},
          { value:"620100", label:"兰州市"},
          { value:"620200", label:"嘉峪关市"},
          { value:"620300", label:"金昌市"},
          { value:"620400", label:"白银市"},
          { value:"620500", label:"天水市"},
          { value:"620600", label:"武威市"},
          { value:"620700", label:"张掖市"},
          { value:"620800", label:"平凉市"},
          { value:"620881", label:"华亭市"},
          { value:"620900", label:"酒泉市"},
          { value:"620981", label:"玉门市"},
          { value:"620982", label:"敦煌市"},
          { value:"621000", label:"庆阳市"},
          { value:"621100", label:"定西市"},
          { value:"621200", label:"陇南市"},
          { value:"622901", label:"临夏市"},
          { value:"623001", label:"合作市"},
          { value:"630100", label:"西宁市"},
          { value:"630200", label:"海东市"},
          { value:"632701", label:"玉树市"},
          { value:"632801", label:"格尔木市"},
          { value:"632802", label:"德令哈市"},
          { value:"632803", label:"茫崖市"},
          { value:"640100", label:"银川市"},
          { value:"640181", label:"灵武市"},
          { value:"640200", label:"石嘴山市"},
          { value:"640300", label:"吴忠市"},
          { value:"640381", label:"青铜峡市"},
          { value:"640400", label:"固原市"},
          { value:"640500", label:"中卫市"},
          { value:"650100", label:"乌鲁木齐市"},
          { value:"650200", label:"克拉玛依市"},
          { value:"650400", label:"吐鲁番市"},
          { value:"650500", label:"哈密市"},
          { value:"652301", label:"昌吉市"},
          { value:"652302", label:"阜康市"},
          { value:"652701", label:"博乐市"},
          { value:"652702", label:"阿拉山口市"},
          { value:"652801", label:"库尔勒市"},
          { value:"652901", label:"阿克苏市"},
          { value:"653001", label:"阿图什市"},
          { value:"653101", label:"喀什市"},
          { value:"653201", label:"和田市"},
          { value:"654002", label:"伊宁市"},
          { value:"654003", label:"奎屯市"},
          { value:"654004", label:"霍尔果斯市"},
          { value:"654201", label:"塔城市"},
          { value:"654202", label:"乌苏市"},
          { value:"654301", label:"阿勒泰市"},
          { value:"659001", label:"石河子市"},
          { value:"659002", label:"阿拉尔市"},
          { value:"659003", label:"图木舒克市"},
          { value:"659004", label:"五家渠市"},
          { value:"659005", label:"北屯市"},
          { value:"659006", label:"铁门关市"},
          { value:"659007", label:"双河市"},
          { value:"659008", label:"可克达拉市"},
          { value:"659009", label:"昆玉市"}
        ],
        tagOptions: [],
        materialOptions: [],
        fileList: [],
        rules: {
        },
        temp: {
          hoursList: [],
          cityList: [],
          networkList: [],
          tagList: []
        },
        admType: "",
        uploadApi: process.env.BASE_API + "/dsp/upload"
      }
    },
    created() {
      this.fetchListTag()
      this.fetchListMaterial()
      this.getStrategy()
    },
    methods: {
      handleSelectAdConfirm(row) {
        this.temp.pmediaid = row.pmediaid
        this.temp.adplacementid = row.adplacementid
        this.temp.adplacementname = row.adplacementname
        this.dialogSelectVisible = false;
      },
      handleSelectAd() {
        this.dialogSelectVisible = true;
        this.getAdList()
      },
      handleFilter() {
        this.adListQuery.page = 1
        this.getAdList()
      },
      getAdList() {
        this.adListLoading = true
        fetchListAdplacement(this.adListQuery).then(response => {
          this.adList = response.data.list
          this.adTotal = response.data.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.adListLoading = false
          }, 0.2 * 1000)
        })
      },
      fetchListMaterial() {
        let query = {
          limit: 2000
        }
        fetchListMaterial(query).then(response => {
          response.data.list.forEach(item => {
            this.materialOptions.push({
              value: item.id,
              label: item.name
            })
          })
          // console.log(this.materialOptions)
        })
      },
      fetchListTag() {
        let query = {
          limit: 1000
        }
        fetchListTag(query).then(response => {
            response.data.list.forEach(item => {
              this.tagOptions.push({
                value: item.id + "",
                label: item.name
              })
            })
        })
      },
      getStrategy() {
        if (this.$route.query.id === undefined) {
          // this.temp.hoursList = []
          // this.temp.cityList = []
          // this.temp.networkList = []
          // this.temp.tagList = []
        } else {
          let query = {
            "id": this.$route.query.id
          }
          getStrategy(query).then(response => {
            this.temp = response.data
            // console.log(this.temp)
          })
        }
      },
      handleRemove() {
        this.fileList = []
        this.temp.adm.materialUrl = ""
        this.temp.adm.dspApiMaterialInnerReqDTO.url = ""
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed() {
        this.$message.warning(`当前限制选择 1 个文件`);
      },
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleUploadSucc(res, file) {
        if (res.code === '200') {
          this.fileList = [
            {
              name: res.fileName,
              url: res.fileUrl
            }
          ]
          this.temp.adm.materialUrl = res.fileUrl;
          this.temp.adm.dspApiMaterialInnerReqDTO.url = res.fileUrl;
        } else {
          return this.$confirm(`上传失败`);
        }
      },
      onSubmit() {
         saveStrategy(this.temp).then(response => {
           this.$message.success(`${response.data}`)
           this.$router.push({path: '/strategy/index'})
         })
      },
      filterObj(obj) {
        for (var key in obj) {
          if (obj[key] !== '' && obj[key] !== -1)
            return false;
        }
        return true;
      }
    }
  }
</script>

<style type="text/css">
  .line_01{
    padding: 0 20px 0;
    margin: 20px 0;
    line-height: 1px;
    border-left: 200px solid #ddd;
    border-right: 200px solid #ddd;
    text-align: center;
  }
</style>
