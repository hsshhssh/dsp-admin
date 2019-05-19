<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px">
      <!--<el-input :placeholder="" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>-->
      <el-select v-model="listQuery.importance" placeholder="广告位" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.importance" placeholder="展示形式" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.importance" placeholder="渠道" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.importance" placeholder="广告位类型" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.importance" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">手动获取广告位</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="广告位ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.adplacementid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告位名称" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.adplacementname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="媒体名称" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.medianame }}</span>
        </template>
      </el-table-column>

      <el-table-column label="展现形式" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column label="渠道" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.platform }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告位类型" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.typedeclare }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告位尺寸" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告位低价" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.bidfloor }}</span>
        </template>
      </el-table-column>

      <el-table-column label="允许素材类型" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.allowmaterial }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">上传素材</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


  </div>
</template>

<script>
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  // arr to obj ,such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: [
          {
            "adplacementid": 1000338,
            "adplacementname": "百度视频_5秒前贴_iphone",
            "medianame": "百度视频",
            "type": "banner",
            "platform": "pc",
            "size": "640*360",
            "bidfloor": 510,
            "typedeclare": "一图一文",
            "allowmaterial": "jpg",
            "status": "初始化"
          },
          {
            "adplacementid": 1000339,
            "adplacementname": "百度视频_5秒前贴_iphone",
            "medianame": "百度视频",
            "type": "banner",
            "platform": "pc",
            "size": "640*360",
            "bidfloor": 510,
            "typedeclare": "一图一文",
            "allowmaterial": "jpg",
            "status": "已上传素材"
          },
          {
            "adplacementid": 1000340,
            "adplacementname": "百度视频_5秒前贴_iphone",
            "medianame": "百度视频",
            "type": "banner",
            "platform": "pc",
            "size": "640*360",
            "bidfloor": 510,
            "typedeclare": "一图一文",
            "allowmaterial": "jpg",
            "status": "已竞价"
          },
          {
            "adplacementid": 1000340,
            "adplacementname": "百度视频_5秒前贴_iphone",
            "medianame": "百度视频",
            "type": "banner",
            "platform": "pc",
            "size": "640*360",
            "bidfloor": 510,
            "typedeclare": "一图一文",
            "allowmaterial": "jpg",
            "status": "已回调"
          },
          {
            "adplacementid": 1000340,
            "adplacementname": "百度视频_5秒前贴_iphone",
            "medianame": "百度视频",
            "type": "banner",
            "platform": "pc",
            "size": "640*360",
            "bidfloor": 510,
            "typedeclare": "一图一文",
            "allowmaterial": "jpg",
            "status": "初始化"
          }
          // {
          //   "adplacementid": 1000340,
          //   "adplacementname": "百度视频_5秒前贴_iphone",
          //   "medianame": "百度视频",
          //   "type": "banner",
          //   "platform": "pc",
          //   "size": "640*360",
          //   "bidfloor": 510,
          //   "typedeclare": "一图一文",
          //   "allowmaterial": "jpg",
          //   "status": "初始化"
          // },
          // {
          //   "adplacementid": 1000340,
          //   "adplacementname": "百度视频_5秒前贴_iphone",
          //   "medianame": "百度视频",
          //   "type": "banner",
          //   "platform": "pc",
          //   "size": "640*360",
          //   "bidfloor": 510,
          //   "typedeclare": "一图一文",
          //   "allowmaterial": "jpg",
          //   "status": "初始化"
          // },
          // {
          //   "adplacementid": 1000340,
          //   "adplacementname": "百度视频_5秒前贴_iphone",
          //   "medianame": "百度视频",
          //   "type": "banner",
          //   "platform": "pc",
          //   "size": "640*360",
          //   "bidfloor": 510,
          //   "typedeclare": "一图一文",
          //   "allowmaterial": "jpg",
          //   "status": "初始化"
          // },
          // {
          //   "adplacementid": 1000340,
          //   "adplacementname": "百度视频_5秒前贴_iphone",
          //   "medianame": "百度视频",
          //   "type": "banner",
          //   "platform": "pc",
          //   "size": "640*360",
          //   "bidfloor": 510,
          //   "typedeclare": "一图一文",
          //   "allowmaterial": "jpg",
          //   "status": "初始化"
          // },
          // {
          //   "adplacementid": 1000340,
          //   "adplacementname": "百度视频_5秒前贴_iphone",
          //   "medianame": "百度视频",
          //   "type": "banner",
          //   "platform": "pc",
          //   "size": "640*360",
          //   "bidfloor": 510,
          //   "typedeclare": "一图一文",
          //   "allowmaterial": "jpg",
          //   "status": "初始化"
          // }
        ],
        total: 10,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 5,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = false
        // fetchList(this.listQuery).then(response => {
        //   this.list = response.data.items
        //   this.total = response.data.total
        //
        //   // Just to simulate the time of the request
        //   setTimeout(() => {
        //     this.listLoading = false
        //   }, 1.5 * 1000)
        // })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            // createArticle(this.temp).then(() => {
            //   this.list.unshift(this.temp)
            //   this.dialogFormVisible = false
            //   this.$notify({
            //     title: '成功',
            //     message: '创建成功',
            //     type: 'success',
            //     duration: 2000
            //   })
            // })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            // updateArticle(tempData).then(() => {
            //   for (const v of this.list) {
            //     if (v.id === this.temp.id) {
            //       const index = this.list.indexOf(v)
            //       this.list.splice(index, 1, this.temp)
            //       break
            //     }
            //   }
            //   this.dialogFormVisible = false
            //   this.$notify({
            //     title: '成功',
            //     message: '更新成功',
            //     type: 'success',
            //     duration: 2000
            //   })
            // })
          }
        })
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        // fetchPv(pv).then(response => {
        //   this.pvData = response.data.pvData
        //   this.dialogPvVisible = true
        // })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
