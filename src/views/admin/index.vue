<template>
  <div class="esms-container">
    <div :class="{ loadingBar: true, show: isLoading }">
      <div class="line" />
      <div class="subline inc" />
      <div class="subline dec" />
    </div>
    <div class="sideBar">
      <span class="appName">
        <span>ESMS</span>
        <br>
        <span>AdminApp</span>
      </span>
      <div class="navigation">
        <div class="btnNav active noHover">
          <div class="iconBox">
            <i class="fas fa-users" />
          </div>
          <span class="btnText">Employees</span>
        </div>
        <div
          :class="{ btnNav: true, active: isShowConfig }"
          @click="toggleShowConfig"
        >
          <div class="iconBox">
            <i class="fas fa-cogs" />
          </div>
          <span class="btnText">Configurations</span>
        </div>
        <div class="btnNav" @click="logout">
          <div class="iconBox">
            <i class="fa fa-sign-out-alt" />
          </div>
          <span class="btnText">Logout</span>
        </div>
        <div class="paddingFlex" />
        <div class="avatarNav">
          <div class="avatarBox">
            <img
              class="avatar"
              :src="avatarUrl"
              alt="EmployeeAvatar"
            >
          </div>
          <span class="avatarText">{{ fullname }}</span>
        </div>
      </div>
    </div>
    <div v-show="isShowConfig" class="mainContent">
      <div class="reportWrapper">
        <div class="reportInner">
          <span class="shiftListTitle">Manage Configurations</span>
          <br>
          <br>
          <el-row>
            <el-col :span="12">
              <span>Acceptable percentage of warning sessions: (%)</span>
              <el-slider v-model="acceptable" :format-tooltip="formatTooltip" />
            </el-col>
            <el-col :span="8" style="padding-left: 10px;">
              <span>Acceptable face-absent time: (ms)</span>
              <el-input v-model="noFace" type="number" />
            </el-col>
            <el-col :span="4" style="text-align: right;">
              <br>
              <el-button
                type="text"
                :disabled="!configs || (acceptable / 100 === configs.angry_percent_max && noFace === configs.no_face_detected_max)"
                @click="updateConfigurations()"
              >
                Update Configurations
              </el-button>
            </el-col>
          </el-row>
          <el-tabs v-model="activeTabName" type="card">
            <el-tab-pane label="Categories" name="category">
              <h4>Manage Categories</h4>
              <el-button @click="importCategoryVisible = true">Import Categories</el-button>
              <el-table
                v-if="categoryList"
                :data="categoryList"
                :height="'calc(100vh - 380px)'"
                style="width: 100%"
              >
                <el-table-column
                  prop="categoryName"
                  label="Category name"
                />
                <el-table-column
                  prop="subtitle"
                  label="Category subtitle"
                />
                <el-table-column
                  label="Operations"
                  width="110"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="warning"
                      icon="el-icon-edit"
                      circle
                      style="line-height: initial;"
                      @click="openUpdateCategory(scope.row)"
                    />
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      style="line-height: initial;"
                      @click="deleteCategoryById(scope.row.id)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Services" name="service">
              <h4>Manage Services</h4>
              <el-button @click="importServiceVisible = true">Import Services</el-button>
              <el-table
                v-if="serviceList"
                :data="serviceList"
                :height="'calc(100vh - 380px)'"
                style="width: 100%"
              >
                <el-table-column
                  prop="code"
                  label="Service code"
                  width="150"
                />
                <el-table-column
                  prop="name"
                  label="Service name"
                />
                <el-table-column
                  label="Category"
                >
                  <template slot-scope="scope">
                    {{ categoryMap ? categoryMap[scope.row.categoryId] : '...' }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="Operations"
                  width="110"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="warning"
                      icon="el-icon-edit"
                      circle
                      style="line-height: initial;"
                      @click="openUpdateService(scope.row)"
                    />
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      style="line-height: initial;"
                      @click="deleteServiceById(scope.row.id)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Counters" name="counter">
              <h4>Manage Counters</h4>
              <el-button @click="importCounterVisible = true">Import Counters</el-button>
              <el-table
                v-if="counterList"
                :data="counterList"
                :height="'calc(100vh - 380px)'"
                style="width: 100%"
              >
                <el-table-column
                  prop="number"
                  label="Counter number"
                  width="150"
                />
                <el-table-column
                  prop="name"
                  label="Counter name"
                />
                <el-table-column
                  label="Operations"
                  width="110"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="warning"
                      icon="el-icon-edit"
                      circle
                      style="line-height: initial;"
                      @click="openUpdateCounter(scope.row)"
                    />
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      style="line-height: initial;"
                      @click="deleteCounterById(scope.row.id)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Shifts" name="shift">
              <h4>Manage Shifts</h4>
              <el-button @click="importShiftVisible = true">Import Shifts</el-button>
              <el-table
                v-if="shiftList"
                :data="shiftList"
                :height="'calc(100vh - 380px)'"
                style="width: 100%"
              >
                <el-table-column
                  prop="name"
                  label="Shift name"
                />
                <el-table-column
                  prop="shiftStart"
                  label="Start time"
                  width="150"
                />
                <el-table-column
                  prop="shiftEnd"
                  label="End time"
                  width="150"
                />
                <el-table-column
                  label="Operations"
                  width="110"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="warning"
                      icon="el-icon-edit"
                      circle
                      style="line-height: initial;"
                      @click="openUpdateShift(scope.row)"
                    />
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      style="line-height: initial;"
                      @click="deleteShiftById(scope.row.id)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div v-show="!isShowConfig" class="mainContent">
      <div class="reportWrapper">
        <div class="reportInner">
          <span class="shiftListTitle">Manage Employees</span>
          <br>
          <el-input
            v-model="searchEmp"
            placeholder="Search for an Employee"
            suffix-icon="el-icon-user"
            style="width: 300px"
          />
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            style="line-height: 15px; margin-left: 10px"
            @click="addEmployeeVisible = true"
          />
          <el-button @click="importEmployeeVisible = true">Import Employees</el-button>
          <el-table
            v-if="filteredEmployeeList"
            :data="filteredEmployeeList"
            :height="'calc(100vh - 212px)'"
            style="width: 100%"
          >
            <el-table-column
              label="Avatar"
              width="90"
            >
              <template slot-scope="scope">
                <img v-if="scope.row.avatarUrl" style="display: block; width: 100%;" :src="scope.row.avatarUrl" alt="EmployeeAvatar">
                <img v-else style="display: block; width: 100%;" :src="logo" alt="EmployeeAvatar">
              </template>
            </el-table-column>
            <el-table-column
              prop="employeeCode"
              label="EmpCode"
              width="90"
            />
            <el-table-column
              prop="fullname"
              label="Full name"
            />
            <el-table-column
              prop="email"
              label="Email"
            />
            <el-table-column
              prop="phoneNumber"
              label="Phone"
              width="150"
            />
            <el-table-column
              label="Role"
              width="110"
            >
              <template slot-scope="scope">
                {{ roleMap ? roleMap[scope.row.roleId] : '...' }}
              </template>
            </el-table-column>
            <el-table-column
              label="Operations"
              width="110"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  circle
                  style="line-height: initial;"
                  @click="openUpdateEmployee(scope.row)"
                />
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  style="line-height: initial;"
                  @click="deleteEmployeeByCode(scope.row.employeeCode)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="Import Employees" :visible.sync="importEmployeeVisible">
      <el-upload
        ref="employeeUploader"
        style="text-align: center;"
        drag
        action="http://api.esms-team.site/employees/bulk-register"
        :headers="{ Authorization: 'Bearer ' + token }"
        :show-file-list="false"
        :on-success="handleImportEmployeesSuccess"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      </el-upload>
    </el-dialog>
    <el-dialog title="Add new Employee" :visible.sync="addEmployeeVisible">
      <el-form ref="addEmpForm" :model="addEmployeeForm" :rules="addEmployeeRules" :label-position="'top'">
        <el-form-item label="Full Name:" prop="fullname">
          <el-input
            v-model="addEmployeeForm.fullname"
          />
        </el-form-item>
        <el-form-item label="Phone Number:" prop="phoneNumber">
          <el-input
            v-model="addEmployeeForm.phoneNumber"
          />
        </el-form-item>
        <el-form-item label="Role:" prop="roleId">
          <el-select
            v-model="addEmployeeForm.roleId"
            placeholder=""
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddEmployee()">Cancel</el-button>
        <el-button type="primary" @click="submitAddEmployee()">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Update an Employee" :visible.sync="updateEmployeeVisible">
      <el-form ref="updateEmpForm" :model="updateEmployeeForm" :rules="updateEmployeeRules" :label-position="'top'">
        <el-form-item label="Full Name:" prop="fullname">
          <el-input
            v-model="updateEmployeeForm.fullname"
          />
        </el-form-item>
        <el-form-item label="Email:" prop="email">
          <el-input
            v-model="updateEmployeeForm.email"
          />
        </el-form-item>
        <el-form-item label="Phone Number:" prop="phoneNumber">
          <el-input
            v-model="updateEmployeeForm.phoneNumber"
          />
        </el-form-item>
        <el-form-item label="Role:" prop="roleId">
          <el-select
            v-model="updateEmployeeForm.roleId"
            placeholder=""
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="updateEmployeeForm.roleId === 3" label="Counter:" prop="counterId">
          <el-select
            v-model="updateEmployeeForm.counterId"
            placeholder=""
          >
            <el-option
              v-for="item in counterList"
              :key="item.id"
              :label="item.number + ' - ' + item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateEmployee()">Cancel</el-button>
        <el-button type="primary" @click="submitUpdateEmployee()">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Import Categories" :visible.sync="importCategoryVisible">
      <el-upload
        ref="categoryUploader"
        style="text-align: center;"
        drag
        action="http://api.esms-team.site/categories"
        :headers="{ Authorization: 'Bearer ' + token }"
        :show-file-list="false"
        :on-success="handleImportCategoriesSuccess"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      </el-upload>
    </el-dialog>
    <el-dialog title="Update a Category" :visible.sync="updateCategoryVisible">
      <el-form ref="updateCatForm" :model="updateCategoryForm" :rules="updateCategoryRules" :label-position="'top'">
        <el-form-item label="Category Name:" prop="categoryName">
          <el-input
            v-model="updateCategoryForm.categoryName"
          />
        </el-form-item>
        <el-form-item label="Subtitle:" prop="subtitle">
          <el-input
            v-model="updateCategoryForm.subtitle"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateCategory()">Cancel</el-button>
        <el-button type="primary" @click="submitUpdateCategory()">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Import Services" :visible.sync="importServiceVisible">
      <el-upload
        ref="serviceUploader"
        style="text-align: center;"
        drag
        action="http://api.esms-team.site/services"
        :headers="{ Authorization: 'Bearer ' + token }"
        :show-file-list="false"
        :on-success="handleImportServicesSuccess"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      </el-upload>
    </el-dialog>
    <el-dialog title="Update a Service" :visible.sync="updateServiceVisible">
      <el-form ref="updateSerForm" :model="updateServiceForm" :rules="updateServiceRules" :label-position="'top'">
        <el-form-item label="Service Name:" prop="name">
          <el-input
            v-model="updateServiceForm.name"
          />
        </el-form-item>
        <el-form-item label="Service Code:" prop="code">
          <el-input
            v-model="updateServiceForm.code"
          />
        </el-form-item>
        <el-form-item label="Category:" prop="categoryId">
          <el-select
            v-model="updateServiceForm.categoryId"
            placeholder=""
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateService()">Cancel</el-button>
        <el-button type="primary" @click="submitUpdateService()">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Import Counters" :visible.sync="importCounterVisible">
      <el-upload
        ref="counterUploader"
        style="text-align: center;"
        drag
        action="http://api.esms-team.site/counters"
        :headers="{ Authorization: 'Bearer ' + token }"
        :show-file-list="false"
        :on-success="handleImportCountersSuccess"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      </el-upload>
    </el-dialog>
    <el-dialog title="Update a Counter" :visible.sync="updateCounterVisible">
      <el-form ref="updateCounForm" :model="updateCounterForm" :rules="updateCounterRules" :label-position="'top'">
        <el-form-item label="Counter Name:" prop="name">
          <el-input
            v-model="updateCounterForm.name"
          />
        </el-form-item>
        <el-form-item label="Counter Number:" prop="number">
          <el-input
            v-model="updateCounterForm.number"
          />
        </el-form-item>
        <el-form-item label="Categories:" prop="categoryIds">
          <el-select
            v-model="updateCounterForm.categoryIds"
            multiple
            placeholder=""
            style="width: 100%;"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateCounter()">Cancel</el-button>
        <el-button type="primary" @click="submitUpdateCounter()">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Import Shifts" :visible.sync="importShiftVisible">
      <el-upload
        ref="shiftUploader"
        style="text-align: center;"
        drag
        action="http://api.esms-team.site/shifts"
        :headers="{ Authorization: 'Bearer ' + token }"
        :show-file-list="false"
        :on-success="handleImportShiftsSuccess"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      </el-upload>
    </el-dialog>
    <el-dialog title="Update a Shift" :visible.sync="updateShiftVisible">
      <el-form ref="updateShForm" :model="updateShiftForm" :rules="updateShiftRules" :label-position="'top'">
        <el-form-item label="Shift Name:" prop="name">
          <el-input
            v-model="updateShiftForm.name"
          />
        </el-form-item>
        <el-form-item label="Start Time:" prop="shiftStart">
          <el-input
            v-model="updateShiftForm.shiftStart"
          />
        </el-form-item>
        <el-form-item label="End Time:" prop="shiftEnd">
          <el-input
            v-model="updateShiftForm.shiftEnd"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateShift()">Cancel</el-button>
        <el-button type="primary" @click="submitUpdateShift()">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, getCategories, updateCategory, deleteCategory, getServices, updateService, deleteService, getCounters, getCounterById, updateCounter, updateCounterCategories, deleteCounter, getShifts, updateShift, deleteShift, getConfigs, updateConfigs } from '@/api/employees'
import { getRoles } from '@/api/roles'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import esmsLogo from '@/assets/esms_logo300.png'
export default {
  name: 'Admin',
  directives: { waves },
  data() {
    return {
      logo: esmsLogo,
      isLoading: false,
      isShowConfig: false,
      searchEmp: null,
      employeeList: [],
      filteredEmployeeList: [],
      roleList: [],
      roleMap: {},
      categoryList: [],
      categoryMap: {},
      serviceList: [],
      counterList: [],
      shiftList: [],
      addEmployeeVisible: false,
      addEmployeeForm: {
        fullname: null,
        phoneNumber: null,
        roleId: null
      },
      addEmployeeRules: {
        fullname: [
          { type: 'string', required: true, message: 'Please input full name', trigger: 'change' }
        ],
        phoneNumber: [
          { type: 'string', required: true, message: 'Please input phone number', trigger: 'change' }
        ],
        roleId: [
          { type: 'number', required: true, message: 'Please select a role', trigger: 'change' }
        ]
      },
      updateEmployeeVisible: false,
      updateEmployeeForm: {
        employeeCode: null,
        fullname: null,
        email: null,
        phoneNumber: null,
        roleId: null,
        counterId: null
      },
      updateEmployeeRules: {
        fullname: [
          { type: 'string', required: true, message: 'Please input full name', trigger: 'change' }
        ],
        email: [
          { type: 'string', required: true, message: 'Please input email', trigger: 'change' }
        ],
        phoneNumber: [
          { type: 'string', required: true, message: 'Please input phone number', trigger: 'change' }
        ],
        roleId: [
          { type: 'number', required: true, message: 'Please select a role', trigger: 'change' }
        ]
      },
      updateCategoryVisible: false,
      updateCategoryForm: {
        id: null,
        categoryName: null,
        subtitle: null
      },
      updateCategoryRules: {
        categoryName: [
          { type: 'string', required: true, message: 'Please input category name', trigger: 'change' }
        ],
        subtitle: [
          { type: 'string', required: true, message: 'Please input category subtitle', trigger: 'change' }
        ]
      },
      updateServiceVisible: false,
      updateServiceForm: {
        name: null,
        categoryId: null,
        code: null
      },
      updateServiceRules: {
        name: [
          { type: 'string', required: true, message: 'Please input service name', trigger: 'change' }
        ],
        code: [
          { type: 'string', required: true, message: 'Please input service code', trigger: 'change' }
        ]
      },
      updateCounterVisible: false,
      updateCounterForm: {
        id: null,
        name: null,
        number: null,
        categoryIds: []
      },
      updateCounterRules: {
        name: [
          { type: 'string', required: true, message: 'Please input counter name', trigger: 'change' }
        ],
        number: [
          { type: 'number', required: true, message: 'Please input counter number', trigger: 'change' }
        ]
      },
      updateShiftVisible: false,
      updateShiftForm: {
        id: null,
        name: null,
        shiftStart: null,
        shiftEnd: null
      },
      updateShiftRules: {
        name: [
          { type: 'string', required: true, message: 'Please input shift name', trigger: 'change' }
        ],
        shiftStart: [
          { type: 'string', required: true, message: 'Please input shift start time', trigger: 'change' }
        ],
        shiftEnd: [
          { type: 'string', required: true, message: 'Please input shift end time', trigger: 'change' }
        ]
      },
      importEmployeeVisible: false,
      importCategoryVisible: false,
      importServiceVisible: false,
      importCounterVisible: false,
      importShiftVisible: false,
      activeTabName: 'category',
      configs: null,
      acceptable: 0,
      noFace: 0
    }
  },
  computed: {
    ...mapGetters(['avatarUrl', 'fullname', 'token', 'profile', 'roles'])
  },
  watch: {
    searchEmp() {
      if (this.employeeList && this.employeeList.length > 0) {
        if (this.searchEmp) {
          this.filteredEmployeeList = this.employeeList.filter(e => e.fullname.toLowerCase().includes(this.searchEmp.toLowerCase()))
        } else {
          this.filteredEmployeeList = this.employeeList
        }
      }
    }
  },
  created() {
    const role = this.roles[0]
    if (role === 'Manager') {
      this.$router.push({ path: '/manager', replace: true })
    } else {
      this.getConfigurations()
      this.getShiftList()
      this.getCounterList()
      this.getServiceList()
      this.getCategoryList()
      this.getRoleList()
      this.getEmployeeList()
    }
  },
  methods: {
    formatTooltip(val) {
      return val + '%'
    },
    getConfigurations() {
      this.isLoading = true
      getConfigs()
        .then(res => {
          const data = res.message
          this.isLoading = false
          this.configs = data
          this.acceptable = this.configs.angry_percent_max * 100
          this.noFace = this.configs.no_face_detected_max
        })
    },
    updateConfigurations() {
      this.isLoading = true
      updateConfigs({
        config: JSON.stringify({
          angry_percent_max: (this.acceptable / 100).toFixed(2),
          no_face_detected_max: this.noFace
        })
      }).then(res => {
        this.isLoading = false
        this.getConfigurations()
      })
    },
    handleImportEmployeesSuccess() {
      this.getEmployeeList()
      this.importEmployeeVisible = false
      this.$refs.employeeUploader.clearFiles()
      this.$message({
        type: 'success',
        message: 'Imported employees successful'
      })
    },
    handleImportCategoriesSuccess() {
      this.getCategoryList()
      this.importCategoryVisible = false
      this.$refs.categoryUploader.clearFiles()
      this.$message({
        type: 'success',
        message: 'Imported categories successful'
      })
    },
    handleImportServicesSuccess() {
      this.getServiceList()
      this.importServiceVisible = false
      this.$refs.serviceUploader.clearFiles()
      this.$message({
        type: 'success',
        message: 'Imported services successful'
      })
    },
    handleImportCountersSuccess() {
      this.getCounterList()
      this.importCounterVisible = false
      this.$refs.counterUploader.clearFiles()
      this.$message({
        type: 'success',
        message: 'Imported counters successful'
      })
    },
    handleImportShiftsSuccess() {
      this.getShiftList()
      this.importShiftVisible = false
      this.$refs.shiftUploader.clearFiles()
      this.$message({
        type: 'success',
        message: 'Imported shifts successful'
      })
    },
    openUpdateShift(sh) {
      this.updateShiftForm.id = sh.id
      this.updateShiftForm.name = sh.name
      this.updateShiftForm.shiftStart = sh.shiftStart
      this.updateShiftForm.shiftEnd = sh.shiftEnd
      this.updateShiftVisible = true
    },
    submitUpdateShift() {
      const form = this.$refs.updateShForm
      form.validate(valid => {
        if (valid) {
          this.isLoading = true
          const updateData = {
            id: form.model.id,
            name: form.model.name,
            shiftStart: form.model.shiftStart,
            shiftEnd: form.model.shiftEnd
          }
          updateShift({
            shifts: [
              updateData
            ]
          }).then(response => {
            this.getShiftList()
            this.updateShiftVisible = false
            this.isLoading = false
            form.resetFields()
            this.$message({
              type: 'success',
              message: 'Updated shift successful'
            })
          })
        } else {
          return false
        }
      })
    },
    cancelUpdateShift() {
      const form = this.$refs.updateShForm
      this.updateShiftVisible = false
      form.resetFields()
    },
    openUpdateCounter(coun) {
      getCounterById(coun.id)
        .then(res => {
          const categories = res.message.counters.Categories
          const categoryIds = categories.map(e => e.id)
          console.log('categoryIds', categoryIds)
          this.updateCounterForm.id = coun.id
          this.updateCounterForm.name = coun.name
          this.updateCounterForm.number = coun.number
          this.updateCounterForm.categoryIds = categoryIds
          this.updateCounterVisible = true
        })
    },
    submitUpdateCounter() {
      const form = this.$refs.updateCounForm
      form.validate(valid => {
        if (valid) {
          this.isLoading = true
          const updateData = {
            id: form.model.id,
            name: form.model.name,
            number: form.model.number
          }
          updateCounter({
            counters: [
              updateData
            ]
          }).then(response => {
            updateCounterCategories(form.model.id, {
              categoryIds: form.model.categoryIds
            }).then(res => {
              this.getCounterList()
              this.updateCounterVisible = false
              this.isLoading = false
              form.resetFields()
              this.$message({
                type: 'success',
                message: 'Updated counter successful'
              })
            })
          })
        } else {
          return false
        }
      })
    },
    cancelUpdateCounter() {
      const form = this.$refs.updateCounForm
      this.updateCounterVisible = false
      form.resetFields()
    },
    openUpdateService(ser) {
      this.updateServiceForm.id = ser.id
      this.updateServiceForm.name = ser.name
      this.updateServiceForm.code = ser.code
      this.updateServiceForm.categoryId = ser.categoryId
      this.updateServiceVisible = true
    },
    submitUpdateService() {
      const form = this.$refs.updateSerForm
      form.validate(valid => {
        if (valid) {
          this.isLoading = true
          const updateData = {
            id: form.model.id,
            name: form.model.name,
            code: form.model.code,
            categoryId: form.model.categoryId
          }
          updateService({
            services: [
              updateData
            ]
          }).then(response => {
            this.getServiceList()
            this.updateServiceVisible = false
            this.isLoading = false
            form.resetFields()
            this.$message({
              type: 'success',
              message: 'Updated service successful'
            })
          })
        } else {
          return false
        }
      })
    },
    cancelUpdateService() {
      const form = this.$refs.updateSerForm
      this.updateServiceVisible = false
      form.resetFields()
    },
    openUpdateCategory(cat) {
      this.updateCategoryForm.id = cat.id
      this.updateCategoryForm.categoryName = cat.categoryName
      this.updateCategoryForm.subtitle = cat.subtitle
      this.updateCategoryVisible = true
    },
    submitUpdateCategory() {
      const form = this.$refs.updateCatForm
      form.validate(valid => {
        if (valid) {
          this.isLoading = true
          const updateData = {
            id: form.model.id,
            categoryName: form.model.categoryName,
            subtitle: form.model.subtitle
          }
          updateCategory({
            categories: [
              updateData
            ]
          }).then(response => {
            this.getCategoryList()
            this.updateCategoryVisible = false
            this.isLoading = false
            form.resetFields()
            this.$message({
              type: 'success',
              message: 'Updated category successful'
            })
          })
        } else {
          return false
        }
      })
    },
    cancelUpdateCategory() {
      const form = this.$refs.updateCatForm
      this.updateCategoryVisible = false
      form.resetFields()
    },
    openUpdateEmployee(emp) {
      this.updateEmployeeForm.employeeCode = emp.employeeCode
      this.updateEmployeeForm.fullname = emp.fullname
      this.updateEmployeeForm.email = emp.email
      this.updateEmployeeForm.phoneNumber = emp.phoneNumber
      this.updateEmployeeForm.roleId = emp.roleId
      this.updateEmployeeForm.counterId = emp.counterId
      this.updateEmployeeVisible = true
    },
    submitUpdateEmployee() {
      const form = this.$refs.updateEmpForm
      form.validate(valid => {
        if (valid) {
          this.isLoading = true
          let updateData = {
            employeeCode: form.model.employeeCode,
            fullname: form.model.fullname,
            email: form.model.email,
            phoneNumber: form.model.phoneNumber,
            avatarUrl: null,
            roleId: form.model.roleId
          }
          if (updateData.roleId === 3) {
            updateData = {
              ...updateData,
              ...{
                counterId: form.model.counterId
              }
            }
          }
          updateEmployee(updateData).then(response => {
            this.getEmployeeList()
            this.updateEmployeeVisible = false
            this.isLoading = false
            form.resetFields()
            this.$message({
              type: 'success',
              message: 'Updated employee successful'
            })
          })
        } else {
          return false
        }
      })
    },
    cancelUpdateEmployee() {
      const form = this.$refs.updateEmpForm
      this.updateEmployeeVisible = false
      form.resetFields()
    },
    submitAddEmployee() {
      const form = this.$refs.addEmpForm
      form.validate(valid => {
        if (valid) {
          this.isLoading = true
          const addData = {
            fullname: form.model.fullname,
            phoneNumber: form.model.phoneNumber,
            avatarUrl: null,
            roleId: form.model.roleId
          }
          addEmployee(addData).then(response => {
            this.getEmployeeList()
            this.addEmployeeVisible = false
            this.isLoading = false
            form.resetFields()
            this.$message({
              type: 'success',
              message: 'Added successful'
            })
          })
        } else {
          return false
        }
      })
    },
    cancelAddEmployee() {
      const form = this.$refs.addEmpForm
      this.addEmployeeVisible = false
      form.resetFields()
    },
    deleteEmployeeByCode(empCode) {
      this.$confirm('Are you sure to permanently delete this employee?', 'Confirm delete', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(() => {
        this.isLoading = true
        deleteEmployee(empCode)
          .then(res => {
            this.isLoading = false
            this.getEmployeeList()
            this.$message({
              type: 'success',
              message: 'Deleted employee successful'
            })
          })
      }).catch(() => {})
    },
    deleteCategoryById(id) {
      this.$confirm('Are you sure to permanently delete this category?', 'Confirm delete', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(() => {
        this.isLoading = true
        deleteCategory({
          ids: [id]
        })
          .then(res => {
            this.isLoading = false
            this.getCategoryList()
            this.$message({
              type: 'success',
              message: 'Deleted category successful'
            })
          })
      }).catch(() => {})
    },
    deleteServiceById(id) {
      this.$confirm('Are you sure to permanently delete this service?', 'Confirm delete', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(() => {
        this.isLoading = true
        deleteService({
          ids: [id]
        })
          .then(res => {
            this.isLoading = false
            this.getServiceList()
            this.$message({
              type: 'success',
              message: 'Deleted service successful'
            })
          })
      }).catch(() => {})
    },
    deleteCounterById(id) {
      this.$confirm('Are you sure to permanently delete this counter?', 'Confirm delete', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(() => {
        this.isLoading = true
        deleteCounter({
          ids: [id]
        })
          .then(res => {
            this.isLoading = false
            this.getCounterList()
            this.$message({
              type: 'success',
              message: 'Deleted counter successful'
            })
          })
      }).catch(() => {})
    },
    deleteShiftById(id) {
      this.$confirm('Are you sure to permanently delete this shift?', 'Confirm delete', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(() => {
        this.isLoading = true
        deleteShift({
          ids: [id]
        })
          .then(res => {
            this.isLoading = false
            this.getShiftList()
            this.$message({
              type: 'success',
              message: 'Deleted shift successful'
            })
          })
      }).catch(() => {})
    },
    getShiftList() {
      this.isLoading = true
      getShifts()
        .then(res => {
          const data = res.message
          this.isLoading = false
          this.shiftList = data
        })
    },
    getCounterList() {
      this.isLoading = true
      getCounters()
        .then(res => {
          const data = res.message
          this.isLoading = false
          this.counterList = data.counters
        })
    },
    getServiceList() {
      this.isLoading = true
      getServices()
        .then(res => {
          const data = res.message
          this.isLoading = false
          this.serviceList = data
        })
    },
    getCategoryList() {
      this.isLoading = true
      getCategories()
        .then(res => {
          const data = res.message
          this.isLoading = false
          this.categoryList = data
          this.categoryList.forEach(e => {
            this.categoryMap[e.id] = e.categoryName
          })
        })
    },
    getRoleList() {
      this.isLoading = true
      getRoles()
        .then(res => {
          const data = res.message
          this.isLoading = false
          this.roleList = data
          this.roleList.forEach(e => {
            this.roleMap[e.id] = e.roleName
          })
        })
    },
    getEmployeeList() {
      this.isLoading = true
      getEmployees()
        .then(res => {
          const data = res.message
          this.isLoading = false
          this.employeeList = data
          this.filteredEmployeeList = this.employeeList
        })
    },
    toggleShowConfig: function() {
      this.isShowConfig = !this.isShowConfig
    },
    async logout() {
      this.$store.dispatch('root/resetToken')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    fourDigits: num => `${`000${num}`.substr(-4)}`,
    twoDigits: num => `${`0${num}`.substr(-2)}`
  }
}
</script>

<style lang="css">
/* scrollbar */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background-color: rgba(91, 155, 213, 0.3);
}
::-webkit-scrollbar-thumb {
  background-color: rgba(91, 155, 213, 0.5);
  border-radius: 10px;
  cursor: pointer;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgb(91, 155, 213);
  cursor: pointer;
}
textarea {
  resize: none !important;
}
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
@import "~@fortawesome/fontawesome-free/css/all.css";

.esms-container {
  position: absolute;
  top: 10px;
  left: 10px;
  width: calc(100vw - 20px);
  height: calc(100vh - 20px);
  background-color: #f8fbff;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  -webkit-box-shadow: 0 0 100px 50px rgba(223, 233, 243, 1);
  -moz-box-shadow: 0 0 100px 50px rgba(223, 233, 243, 1);
  box-shadow: 0 0 100px 50px rgba(223, 233, 243, 1);
}

.acceptable {
  display: flex;
  align-items: center;
  margin-top: 20px;
  font-weight: normal;
}

.acceptable .el-tag {
  margin-left: 10px;
  font-size: 16px;
}

.sideBar {
  display: flex;
  width: 150px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}

.appName {
  text-align: center;
  color: #1479ff;
  font-weight: bold;
  font-size: 16px;
  padding: 40px 0 20px;
}

.navigation {
  flex: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.paddingFlex {
  display: block;
  flex: auto;
}

.btnNav {
  display: flex;
  margin-top: 30px;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.iconBox {
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  color: rgba(19, 121, 255, 0.7);
  background-color: #f9f9f9;
  border: 2px solid rgba(19, 121, 255, 0.1);
  font-size: 20px;
  border-radius: 12px;
  box-shadow: none;
}

.reportNote {
  font-size: 13px;
  font-style: italic;
  color: #909399;
}

.reportNote.sessionHistory {
  padding: 10px 0 0 20px;
}

.noteItem {
  font-weight: bold;
}

.btnNav:not(.freezed):not(.active):hover .iconBox {
  color: #1479ff;
  border-color: rgba(19, 121, 255, 0.7);
}

.btnNav.active .iconBox {
  color: #fff;
  background-color: #1479ff;
  border-color: #1479ff;
}

.btnNav.active:hover .iconBox {
  -webkit-box-shadow: 0 5px 24px 0 rgba(20, 121, 255, 0.3);
  -moz-box-shadow: 0 5px 24px 0 rgba(20, 121, 255, 0.3);
  box-shadow: 0 5px 24px 0 rgba(20, 121, 255, 0.3);
}

.btnNav.freezed,
.btnNav.noHover {
  cursor: auto;
}

.btnNav.freezed:hover .iconBox,
.btnNav.noHover:hover .iconBox {
  box-shadow: none;
}

.btnText {
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  font-weight: bold;
  color: #444;
}

.btnNav.active .btnText,
.btnNav:not(.freezed):hover .btnText {
  color: #1479ff;
}

.avatarNav {
  display: flex;
  margin-bottom: 40px;
  flex-direction: column;
  align-items: center;
}

.avatarBox {
  display: flex;
  width: 70px;
  height: 70px;
  position: relative;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  -webkit-box-shadow: 0 0 12px 0 rgba(20, 121, 255, 0.3);
  -moz-box-shadow: 0 0 12px 0 rgba(20, 121, 255, 0.3);
  box-shadow: 0 0 12px 0 rgba(20, 121, 255, 0.3);
}

.avatarBox::before {
  content: "";
  display: block;
  width: 18px;
  height: 18px;
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #fff;
  border-radius: 50%;
  transform: translate(50%, -50%);
  -webkit-box-shadow: -3px 3px 8px 0 rgba(20, 121, 255, 0.5);
  -moz-box-shadow: -3px 3px 8px 0 rgba(20, 121, 255, 0.5);
  box-shadow: -3px 3px 8px 0 rgba(20, 121, 255, 0.5);
}

.avatarBox::after {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #1479ff;
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.avatarBox img {
  max-width: 100%;
  border-radius: 8px;
}

.avatarText {
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  font-weight: bold;
}

.shiftListWrapper {
  display: block;
  position: relative;
  width: 0;
  height: 100%;
  transition: all 0.1s ease-in;
  overflow: hidden;
}

.shiftListWrapper.show {
  width: 25vw;
}

.shiftListInner {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  width: 25vw;
  padding: 50px 0 50px 50px;
  height: 100%;
  overflow: hidden;
}

.shiftListTitle {
  width: 100%;
  font-weight: bold;
  font-size: 28px;
}

.shiftList {
  flex: auto;
  display: flex;
  height: 0;
  overflow: auto;
  padding-top: 20px;
  flex-direction: column;
  align-items: center;
}

.shiftItem {
  display: flex;
  width: 100%;
  padding: 12px 14px;
  margin: 8px 0;
  justify-content: space-between;
  border: 2px solid #e6f1ff;
  border-radius: 10px;
  color: #999;
  cursor: pointer;
}

.shiftItem.inactive {
  background-color: #e6f1ff;
}

.shiftItem.available {
  border-color: #1479ff;
  color: #1479ff;
}

.shiftItem.available:hover {
  border-color: #1479ff;
  background-color: #1479ff;
  color: #fff;
}
.shiftItem.active {
  border-color: #1479ff;
  background-color: #1479ff;
  color: #fff;
  cursor: auto;
}

.shiftHead {
  display: flex;
  height: 100%;
  align-items: center;
}

.shiftHead i {
  font-size: 16px;
}

.shiftName {
  margin-left: 12px;
}

.shiftTail {
  display: flex;
  height: 100%;
  align-items: center;
  position: relative;
}

.startTime::after {
  content: "-";
  display: inline-block;
  padding-left: 10px;
}

.endTime {
  padding-left: 10px;
}

.shiftBtn {
  position: absolute;
  left: 0;
  width: 100%;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  background-color: #1479ff;
  color: #fff;
  cursor: pointer;
  display: none;
}

.shiftBtn:hover {
  -webkit-box-shadow: 0 0 10px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 10px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 10px 0 rgba(20, 121, 255, 0.2);
}

.shiftItem:hover .shiftBtn {
  display: block;
}

.shiftSeparator {
  width: 50%;
  height: 1px;
  background-color: #999;
  margin: 10px auto;
}

.btnEndShift {
  display: flex;
  width: 100%;
  padding: 10px 12px;
  margin: 16px 0;
  justify-content: center;
  align-items: center;
  background-color: #1479ff;
  border: 2px solid #1479ff;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
}

.btnEndShift:hover {
  -webkit-box-shadow: 0 5px 24px 0 rgba(20, 121, 255, 0.3);
  -moz-box-shadow: 0 5px 24px 0 rgba(20, 121, 255, 0.3);
  box-shadow: 0 5px 24px 0 rgba(20, 121, 255, 0.3);
}

.mainContent {
  display: flex;
  flex-direction: column;
  flex: auto;
  height: 100%;
  padding: 30px 30px 30px 50px;
}

.headerWrapper {
  display: flex;
  width: 100%;
  height: 220px;
  margin-bottom: 20px;
}

.firstPart {
  display: flex;
  width: 100%;
  height: 100%;
  transition: all 0.1s ease-in-out;
}

.secondPart {
  display: flex;
  flex: auto;
  width: 0;
  height: 100%;
  transition: all 0.1s ease-in-out;
}

.overflowHidden {
  overflow: hidden;
}

.headerWrapper.isCheckedIn .firstPart {
  width: 0;
  overflow: hidden;
}

.calendarWrapper {
  display: block;
  width: 250px;
  height: 100%;
  padding: 30px;
  margin-right: 20px;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  -webkit-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
}

span.calendarTitle {
  display: block;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 30px;
}

.greetingWrapper {
  display: flex;
  align-items: center;
  flex: auto;
  height: 100%;
  padding: 20px 50px;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  -webkit-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
}

.welcomeWrapper {
  flex: auto;
  height: 100%;
  padding-top: 5px;
}

.greetingLogo {
  display: block;
  max-height: 100%;
}

span.hello {
  display: block;
  font-size: 25px;
  font-weight: bold;
  padding-bottom: 30px;
}

span.tips {
  display: block;
  font-size: 16px;
  color: #555;
  padding-bottom: 10px;
}

.waitingListWrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 30px 30px 0;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  -webkit-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
}

span.waitingListTitle {
  display: block;
  font-size: 20px;
  font-weight: bold;
}

.waitingList {
  height: 100%;
}

.waitingInner {
  display: flex;
  padding: 20px 0 20px 20px;
  flex: auto;
  height: 100%;
  overflow: auto;
}

.waitingInner::after {
  display: block;
  content: "";
  padding: 0 1px 0 0;
}

.waitingItem {
  display: flex;
  flex-direction: column;
  width: 180px;
  min-width: 180px;
  height: 100%;
  margin-right: 30px;
  background-color: #fff;
  border: 2px solid #f3f8ff;
  border-radius: 15px;
  -webkit-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  position: relative;
}

.waitingItem::before {
  display: block;
  content: "";
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  border-radius: 15px;
  position: absolute;
  top: -2px;
  left: -2px;
  background-color: #fff;
  z-index: 1;
  opacity: 0.6;
}

.waitingItem:first-child:hover {
  border: 2px solid #1479ff;
}

.waitingItem:first-child::before {
  display: none;
}

.waitingItemHead {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: #f3f8ff;
  border-bottom: 2px solid #f3f8ff;
  color: #1479ff;
  font-size: 20px;
  position: relative;
}

.waitingItemHead i.queueIcon {
  display: flex;
  align-items: center;
  position: absolute;
  top: -2px;
  left: -2px;
  height: calc(100% + 4px);
  border-top-left-radius: 15px;
  font-size: 16px;
  padding: 0 12px;
  background-color: #1479ff;
  color: #fff;
}

.waitingItemHead i.skipIcon {
  display: none;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  border-top-right-radius: 15px;
  font-size: 16px;
  padding: 0 10px;
  background-color: #f3f8ff;
  color: #1479ff;
  cursor: pointer;
}

.waitingNo {
  flex: auto;
  text-align: center;
}

.removeIcon {
  position: absolute;
  top: -10px;
  left: -10px;
  z-index: 1;
  font-size: 25px;
  color: #fd6083;
  background-color: #fff;
  padding: 1px;
  border: 1px solid #fd6083;
  border-radius: 50%;
  cursor: pointer;
  display: none;
}

.startSessionBtn {
  position: absolute;
  justify-content: center;
  align-items: center;
  left: 0;
  width: calc(100% - 36px);
  height: 100%;
  padding: 5px;
  background-color: #1479ff;
  border-top-left-radius: 15px;
  color: #fff;
  cursor: pointer;
  display: none;
  font-size: 16px;
}

.startSessionBtn:hover {
  -webkit-box-shadow: 0 0 10px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 10px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 10px 0 rgba(20, 121, 255, 0.2);
}

.waitingItem:first-child:hover .waitingItemHead {
  border-bottom-color: #1479ff;
}

.waitingItem:first-child:hover .removeIcon {
  display: block;
}

.waitingItem:first-child:hover .startSessionBtn {
  display: flex;
}

.waitingItem:first-child:hover i.skipIcon {
  display: flex;
}

.waitingItemTail {
  flex: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 10px;
}

.wNo {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.wCat {
  color: #999;
  text-align: center;
}

.reportWrapper,
.footerWrapper {
  display: flex;
  flex: auto;
  width: 100%;
}

.actionBtn {
  background-color: #ffffff;
  color: #cc002f;
  border: 2px solid #cc002f;
  border-radius: 10px;
  padding: 5px 20px;
  margin-left: 20px;
}

.actionBtn.update {
  color: #e6a23c;
  border: 2px solid #e6a23c;
}

.actionBtn:not(:disabled):hover {
  background-color: #cc002f;
  color: #ffffff;
}

.actionBtn.update:not(:disabled):hover {
  background-color: #e6a23c;
  color: #ffffff;
}

.actionBtn:disabled {
  opacity: 0.5;
}

.footerInner {
  display: flex;
  flex-direction: column;
  flex: auto;
  width: 0;
  height: 100%;
  padding: 30px 30px 0;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  -webkit-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
}

.reportInner {
  display: block;
  flex: auto;
  width: 0;
  height: 100%;
  padding: 30px 30px 0;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  -webkit-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
}

span.footerTitle {
  display: block;
  font-size: 20px;
  font-weight: bold;
  padding: 10px 0 10px 20px;
}

.resultWrapper {
  display: flex;
}

.resultTextWrapper {
  height: 100%;
  flex: auto;
  display: flex;
  align-items: center;
  position: relative;
}

.btnDateWrapper {
  display: block;
}

.btnDate {
  padding: 5px 15px;
  cursor: pointer;
  font-weight: bold;
  background-color: #fff;
  border: 2px solid #1479ff;
  color: #1479ff;
  border-radius: 5px;
}

.btnDate:hover {
  background-color: #1479ff;
  color: #fff;
}

span.resultTextItem {
  display: block;
}

span.resultTextItem span {
  font-weight: bold;
  font-size: 18px;
}

.footerTailWrapper {
  height: 0;
  flex: auto;
  display: flex;
  flex-direction: column;
}

.videoWrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 0;
  overflow: hidden;
  transition: all 0.1s ease;
}

.videoInner {
  display: flex;
  flex: auto;
  justify-content: center;
  height: 100%;
  padding-left: 20px;
  position: relative;
}

.videoOuter {
  height: 100%;
  max-width: 100%;
  padding: 20px 0;
  position: relative;
}

.videoInner video {
  border: 2px solid #f388a0;
  border-radius: 10px;
  height: 100%;
  max-width: 100%
}

.btnCloseEvi {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  color: #cc002f;
}

.angryPeriodsWrapper {
  display: flex;
  flex-direction: column;
  width: 40%;
  min-width: 40%;
  height: 100%;
  padding: 20px 0;
}

span.angryPeriodsTitle {
  display: block;
  font-size: 16px;
  text-decoration: underline;
  color: #cc002f;
}

.angryPeriodsInner {
  display: flex;
  flex-direction: column;
  flex: auto;
  padding: 20px 0;
}

.angryPeriodsInnerInner {
  flex: auto;
  height: 0;
  display: block;
  width: 100%;
  overflow: auto;
  padding-right: 10px;
}

/* scrollbar */
.angryPeriodsInnerInner::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.angryPeriodsInnerInner::-webkit-scrollbar-track {
  background-color: rgba(204, 0, 47, 0.3);
}
.angryPeriodsInnerInner::-webkit-scrollbar-thumb {
  background-color: rgba(204, 0, 47, 0.5);
  border-radius: 10px;
  cursor: pointer;
}
.angryPeriodsInnerInner::-webkit-scrollbar-thumb:hover {
  background-color: rgb(204, 0, 47);
  cursor: pointer;
}

.angryPeriods {
  display: block;
  width: 100%;
}

.periodItem {
  display: flex;
  width: 100%;
  padding: 12px 14px;
  margin: 8px 0;
  justify-content: space-between;
  border: 2px solid #e6f1ff;
  border-radius: 10px;
  color: #999;
  cursor: pointer;
}

.periodItem:hover {
  border-color: #cc002f;
  color: #cc002f;
}

.periodHead {
  display: flex;
  height: 100%;
  align-items: center;
}

.periodHead i {
  font-size: 16px;
}

.periodName {
  margin-left: 12px;
}

.periodTail {
  display: flex;
  height: 100%;
  align-items: center;
  position: relative;
}
.periodDuration {
  padding-left: 10px;
}

.sessionListWrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.1s ease;
}

.sessionList {
  width: 100%;
  flex: auto;
}

.footerTailWrapper.showVideo .videoWrapper {
  height: 100%;
}

.footerTailWrapper.showVideo .sessionListWrapper {
  height: 0;
}

.sessionInner {
  display: flex;
  padding: 20px;
  flex: auto;
  height: 100%;
  overflow: auto;
}

.sessionInner::after {
  display: block;
  content: "";
  padding: 0 1px 0 0;
}

.sessionItem {
  display: flex;
  flex-direction: column;
  width: 200px;
  min-width: 200px;
  height: 100%;
  margin-right: 30px;
  background-color: #fff;
  border: 2px solid #f3f8ff;
  border-radius: 15px;
  -webkit-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
}

.sessionItem:hover {
  border: 2px solid #1479ff;
}

.sessionItemHead {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% + 4px);
  height: 40px;
  margin: -2px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: #f3f8ff;
  overflow: hidden;
  color: #1479ff;
  font-size: 20px;
  position: relative;
}

.sessionItem:first-child:hover .sessionItemHead {
  border-bottom-color: #1479ff;
}

.viewEviBtn {
  position: absolute;
  justify-content: center;
  align-items: center;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color: #1479ff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  color: #fff;
  cursor: pointer;
  display: none;
  font-size: 16px;
}

.viewEviBtn:hover {
  -webkit-box-shadow: 0 0 10px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 10px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 10px 0 rgba(20, 121, 255, 0.2);
}

.sessionItem:hover .viewEviBtn {
  display: flex;
}

.sessionItemTail {
  flex: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  padding: 0 10px;
}

.sname {
  font-weight: bold;
}

.stime {
  font-size: 12px;
}

/* loading bar */
.loadingBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 2px;
  overflow-x: hidden;
  visibility: hidden;
  opacity: 0;
}

.loadingBar.show {
  visibility: visible;
  opacity: 1;
}

.line {
  position: absolute;
  opacity: 0.4;
  background: #4a8df8;
  width: 150%;
  height: 2px;
}

.subline {
  position: absolute;
  background: #4a8df8;
  height: 2px;
}
.inc {
  animation: increase 2s infinite;
}
.dec {
  animation: decrease 2s 0.5s infinite;
}

@keyframes increase {
  from {
    left: -5%;
    width: 5%;
  }
  to {
    left: 130%;
    width: 100%;
  }
}
@keyframes decrease {
  from {
    left: -80%;
    width: 80%;
  }
  to {
    left: 110%;
    width: 10%;
  }
}
</style>
