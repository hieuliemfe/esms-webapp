<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- Title -->
      <el-input v-model="listQuery.employeeCode" placeholder="Employee Code" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- sort -->
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <!-- Select date -->
      <el-date-picker v-model="listQuery.date" class="filter-item" type="date" format="yyyy-MM-dd" placeholder="Select date" :picker-options="pickerOptions1" />
      <!-- Shift -->
      <el-select v-if="listQuery.date" v-model="listQuery.shift" placeholder="Shift" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <!-- button -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        New
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showAvatar" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="No" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Employee Code" width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-employeeCode" @click="handleUpdate(row)">{{ row.employeeCode }}</span>
          <el-tag>{{ row.employeeCode | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Full Name" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.fullname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone Number" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showAvatar" label="Avatar" width="110px" align="center">
        <template slot-scope="">
          <span>row.avatarUrl</span>
        </template>
      </el-table-column>
      <el-table-column label="Create At" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.createAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Active" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='deactivate'" size="mini" type="success" @click="handleActivate(row,'deactivate')">
            Deactive
          </el-button>
          <el-button v-if="row.status!='activate'" size="mini" @click="handleActivate(row,'activate')">
            Activate
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="registerForm" :rules="rules" :model="registerForm" label-position="left" label-width="70px" style="width: 500px; margin-left:50px;">
        <div class="createEmployee-main-container">
          <!-- avatar -->
          <el-row>
            <el-col class=".avatarthumb">
              <pan-thumb :image="image" />
            </el-col>
          </el-row>
          <el-row style="margin-top: 60px">
            <el-col class=".avatarthumb">
              <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;" @click="imagecropperShow=true">
                Change Avatar
              </el-button>
              <image-cropper
                v-show="imagecropperShow"
                :key="imagecropperKey"
                :width="300"
                :height="300"
                url="https://httpbin.org/post"
                lang-type="en"
                @close="close"
                @crop-upload-success="cropSuccess"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item class="register" prop="avatarUrl">
                <MDinput v-model="registerForm.avatarUrl" :maxlength="100" name="avatarUrl" type="url">
                  Avatar Url
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- fullname -->
          <el-row>
            <el-col>
              <el-form-item class="register" prop="fullname">
                <MDinput v-model="registerForm.fullname" :maxlength="100" name="fullname" required type="text">
                  Full Name*
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- phoneNumber -->
          <el-row>
            <el-col>
              <el-form-item class="register" prop="phoneNumber">
                <MDinput v-model="registerForm.phoneNumber" :maxlength="100" name="phoneNumber" required type="tel">
                  Phone Number*
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- role -->
          <el-row>
            <el-col>
              <el-form-item class="register" prop="roleId">
                <MDinput v-model="registerForm.roleId" value="3" name="roleId" required type="text" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-loading="loading" @click="clearForm">
          Clear
        </el-button>
        <el-button type="success" @click="dialogStatus==='create'?createData():updateData()">
          Active
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getListEmployee } from '@/api/employees'
import MDinput from '@/components/MDinput'
import waves from '@/directive/waves' // waves directive
import ImageCropper from '@/components/ImageCropper'
import { validURL, validTel, validFullname } from '@/utils/validate'
import PanThumb from '@/components/PanThumb'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'EmployeeTable',
  components: { MDinput, Pagination, ImageCropper, PanThumb },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        activate: 'success',
        deactivate: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '' | !value) {
        this.$message({
          message: 'Full name is required',
          type: 'error'
        })
        callback(new Error('Full name is required'))
      } else {
        if (validFullname(value)) {
          callback()
        } else {
          this.$message({
            message: 'Full name contains only letters',
            type: 'error'
          })
        }
      }
    }
    const validateTel = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: 'Phone number is required',
          type: 'error'
        })
        callback(new Error('Phone number is required'))
      } else {
        if (validTel(value)) {
          callback()
        } else {
          this.$message({
            message: 'Phone number is number',
            type: 'error'
          })
        }
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: 'The external link URL is incorrectly filled',
            type: 'error'
          })
          callback(new Error('The external link URL is incorrectly filled'))
        }
      } else {
        callback()
      }
    }
    const defaultForm = {
      fullname: '',
      phoneNumber: '123',
      avatarUrl: '',
      roleId: '3'
    }
    return {
      isHidden: false,
      registerForm: Object.assign({}, defaultForm),
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        date: undefined,
        page: 1,
        limit: 20,
        importance: undefined,
        employeeCode: undefined,
        type: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showAvatar: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        fullname: [{ validator: validateName }],
        phoneNumber: [{ validator: validateTel }],
        avatarUrl: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      downloadLoading: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
      pickerOptions1: {
        shortcuts: [{
          text: 'Today',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      datePicker: ''
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    console.log('registerForm', this.registerForm)
  },
  methods: {
    getList() {
      this.listLoading = true
      getListEmployee(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleActivate(row, status) {
      this.$message({
        message: 'Update success',
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
      this.registerForm = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        employeeCode: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['registerForm'].clearValidate()
      })
    },
    createData() {
      // this.$refs['registerForm'].validate((valid) => {
      //   if (valid) {
      //     this.registerForm.id = parseInt(Math.random() * 100) + 1024 // mock a id
      //     this.registerForm.author = 'vue-element-admin'
      //     createArticle(this.registerForm).then(() => {
      //       this.list.unshift(this.registerForm)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         employeeCode: 'Success',
      //         message: 'Created Successfully',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // }),
      console.log(this.registerForm)
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            name: 'success',
            message: 'Create the employee successfully',
            type: 'success',
            duration: 2000
          })
          this.$store.dispatch('root/register', this.registerForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleUpdate(row) {
      // this.registerForm = Object.assign({}, row) // copy obj
      // this.registerForm.timestamp = new Date(this.registerForm.timestamp)
      // this.dialogStatus = 'update'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['registerForm'].clearValidate()
      // })
    },
    updateData() {
      // this.$refs['registerForm'].validate((valid) => {
      //   if (valid) {
      //     const registerFormData = Object.assign({}, this.registerForm)
      //     registerFormData.timestamp = +new Date(registerFormData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      //     updateArticle(registerFormData).then(() => {
      //       const index = this.list.findIndex(v => v.id === this.registerForm.id)
      //       this.list.splice(index, 1, this.registerForm)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         employeeCode: 'Success',
      //         message: 'Update Successfully',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // })
    },
    handleDownload() {
      // this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'employeeCode', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'employeeCode', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    clearForm() {
      this.registerForm.roleId = 3
      this.registerForm.avatarUrl = ''
      this.registerForm.fullname = ''
      this.registerForm.phoneNumber = ''
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatarUrl
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-col .avatarthumb{
    display: flex;
    justify-content: center;
    align-items: center;
}
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.avatarUrl{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>
