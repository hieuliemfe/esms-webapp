<template>
  <div class="esms-container">
    <div :class="{ loadingBar: true, show: isLoading }">
      <div class="line" />
      <div class="subline inc" />
      <div class="subline dec" />
    </div>
    <div class="sideBar">
      <span class="appName">EsmsManager</span>
      <div class="navigation">
        <div class="btnNav active noHover">
          <div class="iconBox">
            <i class="fa fa-home" />
          </div>
          <span class="btnText">Home</span>
        </div>
        <div
          :class="{ btnNav: true, active: isShowemployeeList, freezed: isShowReport }"
          @click="toggleShowemployeeList"
        >
          <div class="iconBox">
            <i class="fas fa-users" />
          </div>
          <span class="btnText">Employees</span>
        </div>
        <div
          :class="{ btnNav: true, active: isShowReport }"
          @click="toggleShowReport"
        >
          <div class="iconBox">
            <i class="far fa-chart-bar" />
          </div>
          <span class="btnText">Report</span>
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
    <div v-if="!isShowReport" :class="{ shiftListWrapper: true, show: isShowemployeeList }">
      <div class="shiftListInner">
        <span class="shiftListTitle">Warning Bank Tellers</span>
        <br>
        <el-date-picker
          v-model="selectedWeekDay"
          type="week"
          format="[Week] WW [of Year] yyyy"
          placeholder="Pick a week"
          :picker-options="weekPickerOptions"
          :editable="false"
          :clearable="false"
        />
        <br>
        <br>
        <span class="reportNote"><span class="noteItem">*WS:</span> Warning Sessions - number of sessions recorded with angry warnings.</span>
        <div class="shiftList">
          <div
            v-for="employee in employeeList"
            :key="employee.id"
            :class="{ available: true, shiftItem: true, active: employee.id === selectedEmployee.id }"
            @click="selectEmployee(employee)"
          >
            <div class="shiftHead">
              <!-- <i class="far fa-clock" /> -->
              <span class="shiftName">{{ employee.fullname }}</span>
            </div>
            <div class="shiftTail">
              <!-- <span class="startTime">{sh.shiftStart}</span> -->
              <span class="endTime">{{
                `WS: ${employee.totalWarningSessions}`
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isShowReport" class="mainContent">
      <div class="reportWrapper">
        <div class="reportInner">
          <span class="shiftListTitle">Employee Status Report</span>
          <br>
          <el-date-picker
            v-model="selectedRange"
            type="daterange"
            format="dd/MM/yyyy"
            range-separator="to"
            start-placeholder="Start date"
            end-placeholder="End date"
            :editable="false"
            :clearable="false"
            :picker-options="reportPickerOptions"
          />
          <br>
          <span
            v-if="reportTableData"
            class="acceptable"
          >
            Acceptable percentage of warning session:
            <el-tag
              type="danger"
              disable-transitions
            >
              {{ angryPercentMax * 100 }}%
            </el-tag>
          </span>
          <br>
          <span v-if="reportTableData" class="reportNote"><span class="noteItem">*Face-absences:</span> counting when camera cannot detect Bank Teller face for more than a minute due to leaving the working space or improper sitting posture.</span>
          <br>
          <br>
          <el-table
            v-if="reportTableData"
            :data="reportTableData"
            :height="'calc(100vh - 368px)'"
            style="width: 100%"
          >
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
              prop="totalSession"
              label="Total session"
              align="right"
              width="110"
            />
            <el-table-column
              prop="totalWarningSessions"
              label="Warning session"
              align="right"
              width="140"
            />
            <el-table-column
              prop="angrySessionPercent"
              label="Warning session (%)"
              align="right"
              width="160"
            />
            <el-table-column
              prop="totalFaceAbscences"
              label="Face-absences"
              align="right"
              width="140"
            />
            <el-table-column
              prop="suspensionCount"
              label="Suspensions"
              align="right"
              width="140"
            />
          </el-table>
          <br>
          <el-button
            v-if="reportTableData"
            type="danger"
            icon="el-icon-download"
            @click="downloadReport('pdf')"
          >
            Export to PDF
          </el-button>
          <el-button
            v-if="reportTableData"
            type="success"
            icon="el-icon-download"
            @click="downloadReport('xlsx')"
          >
            Export to Excel
          </el-button>
        </div>
      </div>
    </div>
    <div v-show="!isShowReport" class="mainContent">
      <div class="headerWrapper">
        <div class="firstPart">
          <div class="greetingWrapper">
            <div class="welcomeWrapper">
              <span class="hello"> Hello, {{ fullname }}</span>
              <span class="tips">Have a nice day!</span>
              <span class="tips">
                Welcome to Employee Status Monitoring website!
              </span>
            </div>
            <img :src="logo" alt="ESMSLogo" class="greetingLogo">
          </div>
        </div>
      </div>
      <div class="footerWrapper">
        <div class="footerInner">
          <div class="resultWrapper">
            <div class="resultTextWrapper">
              <span class="footerTitle">Bank Teller Warning Sessions</span>
              <button
                v-if="sessionList && sessionList.length > 0 && selectedEmployee.Suspensions && selectedEmployee.Suspensions.length > 0"
                class="actionBtn"
                :disabled="true"
              >
                Currently in Suspension
              </button>
              <button
                v-if="sessionList && sessionList.length > 0 && selectedEmployee.Suspensions && selectedEmployee.Suspensions.length > 0"
                class="actionBtn update"
                :disabled="!isShowUpdateSus"
                @click="openUpdate"
              >
                {{ isShowUpdateSus ? 'Update Suspension' : 'Expire within 15 minutes' }}
              </button>
              <button
                v-if="isShowActionBtn && sessionList && sessionList.length > 0 && selectedEmployee.angrySessionPercent > angryPercentMax && !(selectedEmployee.Suspensions && selectedEmployee.Suspensions.length > 0)"
                class="actionBtn"
                @click="dialogFormVisible = true"
              >
                Take an Action
              </button>
            </div>
          </div>
          <div
            :class="{footerTailWrapper: true, showVideo: isShowEvi}"
          >
            <div class="videoWrapper">
              <div v-if="periodEviName && eviPeriods && eviPeriods[periodEviName] && eviPeriods[periodEviName].length > 0" class="angryPeriodsWrapper">
                <span class="angryPeriodsTitle">
                  Angry Periods:
                </span>
                <div class="angryPeriodsInner">
                  <div class="angryPeriodsInnerInner">
                    <div v-if="isShowEvi" class="angryPeriods">
                      <div
                        v-for="period in eviPeriods[periodEviName]"
                        :key="period.period_start"
                        class="periodItem"
                        @click="skipToPeriod(period.period_start)"
                      >
                        <div class="periodHead">
                          <i class="fas fa-history" />
                          <span class="periodName">
                            {{ `P${fourDigits(period.no)}` }}
                          </span>
                        </div>
                        <div class="periodTail">
                          <span class="periodDuration">
                            {{ `Duration: ${msToStr(period.duration)}` }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="videoInner">
                <div class="videoOuter">
                  <div
                    class="btnCloseEvi"
                    @click="closeEvi"
                  >
                    <i class="fa fa-times" />
                    {{ ` Close` }}
                  </div>
                  <video v-if="videoEviName" ref="videoRef" controls autoPlay>
                    <source
                      :src="eviVideos[videoEviName]"
                      type="video/mp4"
                    >
                    No video found
                  </video>
                </div>
              </div>
            </div>
            <span v-if="!isShowEvi && sessionList && sessionList.length > 0" class="reportNote sessionHistory"><span class="noteItem">*Angry Warnings:</span> Each minute, if more than 15 seconds of angry facial expression detected, an angry warning will be recorded.</span>
            <div class="sessionListWrapper">
              <div class="sessionList">
                <div v-if="sessionList && sessionList.length > 0" class="sessionInner">

                  <div v-for="session in sessionList" :key="session.id" class="sessionItem">
                    <div
                      class="sessionItemHead"
                      @click="showEvi(session.id)"
                    >
                      <i class="far fa-clock" />
                      <div class="viewEviBtn">
                        Show Evidence
                      </div>
                    </div>
                    <div class="sessionItemTail">
                      <span class="sname">
                        {{ `session_${fourDigits(session.id)}` }}
                      </span>
                      <span />
                      <span class="stime">
                        {{ `Date: ${getClientDate(session.sessionStart)}` }}
                      </span>
                      <span class="stime">
                        {{ `Time: ${getClientTime(session.sessionStart)}` }}
                      </span>
                      <span class="stime">
                        {{ `Duration: ${msToStr(session.sessionDuration)}` }}
                      </span>
                      <span class="stime">
                        {{ `Angry Warnings: ${session.angryWarningCount}` }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="Suspend this Bank Teller account" :visible.sync="dialogFormVisible">
      <el-form ref="susForm" :model="suspendForm" :rules="suspendRules">
        <el-form-item label="Reason:" prop="reason">
          <el-input
            v-model="suspendForm.reason"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
          />
        </el-form-item>
        <el-form-item label="Expires after:" prop="expiration">
          <el-date-picker
            v-model="suspendForm.expiration"
            type="datetime"
            format="dd/MM/yyyy HH:mm:ss"
            :editable="false"
            :clearable="false"
            :picker-options="suspendPickerOptions"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSuspend()">Cancel</el-button>
        <el-button type="primary" @click="submitSuspend()">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Update Suspension for this Bank Teller account" :visible.sync="updateFormVisible">
      <el-form ref="updateSusForm" :model="updateSuspendForm" :rules="updateSuspendRules">
        <el-form-item label="Reason:" prop="reason">
          <el-input
            v-model="updateSuspendForm.reason"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
          />
        </el-form-item>
        <el-form-item
          v-if="selectedEmployee && selectedEmployee.Suspensions && selectedEmployee.Suspensions[0]"
          label="Current Expiration:"
        >
          <el-date-picker
            v-model="selectedEmployee.Suspensions[0].expiredOn"
            type="datetime"
            format="dd/MM/yyyy HH:mm:ss"
            :readonly="true"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item label="New Expiration:" prop="expiration">
          <el-date-picker
            v-model="updateSuspendForm.expiration"
            type="datetime"
            format="dd/MM/yyyy HH:mm:ss"
            :editable="false"
            :clearable="false"
            :picker-options="updateSuspendPickerOptions"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateSuspend()">Cancel</el-button>
        <el-button type="primary" @click="submitUpdateSuspend()">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import FilterContainer from '@/components/Filter'
// import ActionSuggest from './components/ActionToImproveList'
// import WarningList from './components/WarningList'
// import ReportEmotion from './components/ReportEmotion'
import { getReport, getWarningList, getSessionHistory, getGCSUrl, suspendEmployee, updateSuspendEmployee, getConfigs, getSessionMinDate } from '@/api/employees'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import esmsLogo from '@/assets/esms_logo300.png'
export default {
  name: 'TakeCareEmployee',
  // components: { WarningList, ActionSuggest, ReportEmotion, FilterContainer },
  directives: { waves },
  data() {
    const validateSusExp = (rule, value, callback) => {
      if (value.getTime() <= Date.now()) {
        callback(new Error('Expiration time must be a future time.'))
      } else if (value.getTime() <= Date.now() + 15 * 60 * 1000) {
        callback(new Error('Expiration time must be at least 15 minutes from now.'))
      } else {
        callback()
      }
    }
    const validateUpdateSusExp = (rule, value, callback) => {
      const oldExp = this.selectedEmployee && this.selectedEmployee.Suspensions && this.selectedEmployee.Suspensions[0] ? new Date(this.selectedEmployee.Suspensions[0].expiredOn) : null
      if (oldExp && oldExp.getTime() <= Date.now() + 15 * 60 * 1000) {
        this.cancelUpdateSuspend()
        this.selectedEmployee = JSON.parse(JSON.stringify(this.selectedEmployee))
      }
      if (value.getTime() <= Date.now()) {
        callback(new Error('New Expiration time must be a future time.'))
      } else if (value.getTime() <= Date.now() + 15 * 60 * 1000) {
        callback(new Error('New Expiration time must be at least 15 minutes from now.'))
      } else if (oldExp && value.getTime() > oldExp.getTime()) {
        callback(new Error('New Expiration time must be sooner than the current one.'))
      } else {
        callback()
      }
    }
    return {
      logo: esmsLogo,
      isLoading: false,
      isShowemployeeList: true,
      isShowReport: false,
      isShowEvi: false,
      employeeList: [],
      selectedEmployee: {},
      dialogFormVisible: false,
      updateFormVisible: false,
      selectedWeekDay: new Date(),
      prevSelectedWeekDay: new Date(),
      selectedRange: null,
      reportTableData: null,
      periodEviName: null,
      videoEviName: null,
      eviVideos: {},
      eviPeriods: {},
      minDate: new Date(0),
      sessionList: [],
      angryPercentMax: 1,
      isShowUpdateSus: true,
      suspendForm: {
        reason: null,
        expiration: null
      },
      updateSuspendForm: {
        reason: null,
        expiration: null
      },
      suspendRules: {
        expiration: [
          { type: 'date', required: true, message: 'Please input an expiration time for this suspension', trigger: 'change' },
          { validator: validateSusExp, trigger: 'change' }
        ]
      },
      updateSuspendRules: {
        expiration: [
          { type: 'date', required: true, message: 'Please input new expiration time for this suspension', trigger: 'change' },
          { validator: validateUpdateSusExp, trigger: 'change' }
        ]
      },
      reportPickerOptions: {
        firstDayOfWeek: 1,
        disabledDate: function(time) {
          const tomorrow = new Date()
          tomorrow.setHours(0)
          tomorrow.setMinutes(0)
          tomorrow.setSeconds(0)
          tomorrow.setMilliseconds(0)
          tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000)
          return time.getTime() < this.minDate.getTime() ||
            time.getTime() >= tomorrow.getTime()
        }.bind(this)
      },
      weekPickerOptions: {
        firstDayOfWeek: 1,
        disabledDate: function(time) {
          const mDate = new Date(this.minDate)
          mDate.setTime(mDate.getTime() - (mDate.getDay() - 1) * 24 * 60 * 60 * 1000)
          const nextWeekDay = new Date()
          nextWeekDay.setHours(0)
          nextWeekDay.setMinutes(0)
          nextWeekDay.setSeconds(0)
          nextWeekDay.setMilliseconds(0)
          nextWeekDay.setTime(nextWeekDay.getTime() + (8 - nextWeekDay.getDay()) * 24 * 60 * 60 * 1000)
          return time.getTime() < mDate.getTime() ||
            time.getTime() >= nextWeekDay.getTime()
        }.bind(this)
      },
      suspendPickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          const currentDate = new Date()
          currentDate.setHours(0)
          currentDate.setMinutes(0)
          currentDate.setSeconds(0)
          currentDate.setMilliseconds(0)
          return time.getTime() < currentDate.getTime()
        }
      },
      updateSuspendPickerOptions: {
        firstDayOfWeek: 1,
        disabledDate: function(time) {
          const currentDate = new Date()
          currentDate.setHours(0)
          currentDate.setMinutes(0)
          currentDate.setSeconds(0)
          currentDate.setMilliseconds(0)
          return time.getTime() < currentDate.getTime() || (
            this.selectedEmployee &&
            this.selectedEmployee.Suspensions &&
            this.selectedEmployee.Suspensions[0] &&
            this.selectedEmployee.Suspensions[0].expiredOn &&
            time.getTime() > new Date(this.selectedEmployee.Suspensions[0].expiredOn).getTime()
          )
        }.bind(this)
      }
    }
  },
  computed: {
    ...mapGetters(['avatarUrl', 'fullname', 'token']),
    isShowActionBtn() {
      const startWeekDay = new Date()
      startWeekDay.setHours(0)
      startWeekDay.setMinutes(0)
      startWeekDay.setSeconds(0)
      startWeekDay.setMilliseconds(0)
      startWeekDay.setTime(startWeekDay.getTime() - (startWeekDay.getDay() - 1) * 24 * 60 * 60 * 1000)
      return this.prevSelectedWeekDay.getTime() >= startWeekDay.getTime()
    }
  },
  watch: {
    selectedWeekDay() {
      this.updateEmployeeList()
    },
    selectedRange() {
      this.updateReport()
    },
    selectedEmployee(value) {
      if (value && value.employeeCode) {
        this.isShowUpdateSus = value.Suspensions && value.Suspensions[0] && (new Date(value.Suspensions[0].expiredOn).getTime() > Date.now() + 15 * 60 * 1000)
        this.updateSuspendForm.reason = value.Suspensions && value.Suspensions[0] ? value.Suspensions[0].reason : null
        this.updateSessionList()
      }
    },
    videoEviName() {
      const videoRef = this.$refs.videoRef
      if (videoRef) {
        videoRef.pause()
        videoRef.load()
        videoRef.play()
      }
    }
  },
  created() {
    this.getMin()
    this.getList()
    this.getConfigurations()
  },
  methods: {
    getMin() {
      getSessionMinDate()
        .then(response => {
          if (response.success) {
            const mDate = new Date(response.message)
            mDate.setHours(0)
            mDate.setMinutes(0)
            mDate.setSeconds(0)
            mDate.setMilliseconds(0)
            this.minDate = mDate
            console.log('mindate', this.minDate)
          }
        })
    },
    openUpdate() {
      this.updateFormVisible = true
    },
    updateReport() {
      if (this.selectedRange && this.selectedRange.length > 0) {
        this.isLoading = true
        const selectedStart = new Date(this.selectedRange[0])
        selectedStart.setHours(0)
        selectedStart.setMinutes(0)
        selectedStart.setSeconds(0)
        selectedStart.setMilliseconds(0)
        const selectedEnd = new Date(this.selectedRange[1])
        selectedEnd.setHours(0)
        selectedEnd.setMinutes(0)
        selectedEnd.setSeconds(0)
        selectedEnd.setMilliseconds(0)
        selectedEnd.setTime(selectedEnd.getTime() + 24 * 60 * 60 * 1000)
        return getReport({ type: 'json', startDate: selectedStart.toJSON(), endDate: selectedEnd.toJSON() }).then(response => {
          this.isLoading = false
          const reportList = response.message
          if (reportList) {
            reportList.forEach(e => {
              e.angrySessionPercent = e.angrySessionPercent ? `${(e.angrySessionPercent * 100).toFixed(1)}%` : '-'
              e.suspensionCount = e.Suspensions ? e.Suspensions.length : '-'
            })
            this.reportTableData = reportList
          }
        })
      }
    },
    downloadReport(exportType) {
      if (this.selectedRange && this.selectedRange.length > 0) {
        this.isLoading = true
        const selectedStart = new Date(this.selectedRange[0])
        selectedStart.setHours(0)
        selectedStart.setMinutes(0)
        selectedStart.setSeconds(0)
        selectedStart.setMilliseconds(0)
        const selectedEnd = new Date(this.selectedRange[1])
        selectedEnd.setHours(0)
        selectedEnd.setMinutes(0)
        selectedEnd.setSeconds(0)
        selectedEnd.setMilliseconds(0)
        selectedEnd.setTime(selectedEnd.getTime() + 24 * 60 * 60 * 1000)
        const objToParamStr = (obj) =>
          Object.entries(obj)
            .map((e) => e.join('='))
            .join('&')
        const queryData = { type: exportType, startDate: selectedStart.toJSON(), endDate: selectedEnd.toJSON() }
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${this.token}`)
        fetch(
          `http://api.esms-team.site/reports?${objToParamStr(queryData)}`,
          { headers }
        )
          .then(res => res.blob())
          .then(blob => {
            this.isLoading = false
            const link = document.createElement('a')
            const objUrl = URL.createObjectURL(blob)
            link.href = objUrl
            link.download = `ESMSReport.${exportType}`
            link.dispatchEvent(new MouseEvent('click'))
            URL.revokeObjectURL(objUrl)
          })
      }
    },
    getConfigurations() {
      getConfigs().then(response => {
        if (response.success) {
          const data = response.message
          if (data) {
            const { angry_percent_max } = data
            this.angryPercentMax = angry_percent_max
          }
        }
      })
    },
    cancelSuspend() {
      const form = this.$refs.susForm
      form.resetFields()
      console.log('hello cancel')
      this.dialogFormVisible = false
    },
    cancelUpdateSuspend() {
      const form = this.$refs.updateSusForm
      form.resetFields()
      console.log('hello cancel')
      this.updateFormVisible = false
    },
    submitSuspend() {
      const form = this.$refs.susForm
      form.validate(valid => {
        if (valid) {
          this.isLoading = true
          suspendEmployee(this.selectedEmployee.employeeCode, form.model).then(response => {
            console.log(response)
            this.dialogFormVisible = false
            form.resetFields()
            this.isLoading = false
            this.updateEmployeeList().then(() => {
              this.selectedEmployee = this.employeeList.find(e => e.id === this.selectedEmployee.id)
            })
          })
        } else {
          return false
        }
      })
    },
    submitUpdateSuspend() {
      const form = this.$refs.updateSusForm
      form.validate(valid => {
        if (valid) {
          this.isLoading = true
          updateSuspendEmployee(this.selectedEmployee.employeeCode, {
            ...form.model,
            id: this.selectedEmployee.Suspensions[0].id
          }).then(response => {
            console.log(response)
            this.updateFormVisible = false
            form.resetFields()
            this.isLoading = false
            this.updateEmployeeList().then(() => {
              this.selectedEmployee = this.employeeList.find(e => e.id === this.selectedEmployee.id)
            })
          })
        } else {
          return false
        }
      })
    },
    getList() {
      this.isLoading = true
      const selectedDate = new Date(this.selectedWeekDay)
      selectedDate.setHours(0)
      selectedDate.setMinutes(0)
      selectedDate.setSeconds(0)
      selectedDate.setMilliseconds(0)
      selectedDate.setTime(selectedDate.getTime() - (selectedDate.getDay() - 1) * 24 * 60 * 60 * 1000)
      const nextWeekDate = new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      getWarningList({ role: 3, startDate: selectedDate, endDate: nextWeekDate }).then(response => {
        this.employeeList = response.message
        this.isLoading = false
      })
    },
    selectEmployee(employee) {
      if (employee.id !== this.selectedEmployee.id) {
        this.isLoading = true
        this.selectedEmployee = employee
      }
    },
    updateEmployeeList() {
      this.isLoading = true
      const selectedDate = new Date(this.selectedWeekDay)
      selectedDate.setHours(0)
      selectedDate.setMinutes(0)
      selectedDate.setSeconds(0)
      selectedDate.setMilliseconds(0)
      selectedDate.setTime(selectedDate.getTime() - (selectedDate.getDay() - 1) * 24 * 60 * 60 * 1000)
      const nextWeekDate = new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      return getWarningList({ role: 3, startDate: selectedDate, endDate: nextWeekDate }).then(response => {
        this.employeeList = response.message
        const slEmp = this.employeeList.find(e => e.id === this.selectedEmployee.id)
        this.isLoading = false
        this.prevSelectedWeekDay = new Date(this.selectedWeekDay)
        if (slEmp) {
          this.selectedEmployee = slEmp
        } else {
          this.selectedEmployee = {}
          this.sessionList = []
        }
      })
    },
    updateSessionList() {
      this.isLoading = true
      const code = this.selectedEmployee.employeeCode
      if (code) {
        const selectedDate = new Date(this.selectedWeekDay)
        selectedDate.setHours(0)
        selectedDate.setMinutes(0)
        selectedDate.setSeconds(0)
        selectedDate.setMilliseconds(0)
        selectedDate.setTime(selectedDate.getTime() - (selectedDate.getDay() - 1) * 24 * 60 * 60 * 1000)
        const nextWeekDate = new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        return getSessionHistory({ employeeCode: code, startDate: selectedDate, endDate: nextWeekDate }).then(response => {
          this.isLoading = false
          this.sessionList = response.message.sessions
        })
      }
    },
    getClientDate(dateStr) {
      const date = new Date(dateStr)
      return `${this.twoDigits(date.getDate())}/${this.twoDigits(
        date.getMonth() + 1
      )}/${date.getFullYear()}`
    },
    getClientTime(dateStr) {
      const date = new Date(dateStr)
      return `${this.twoDigits(date.getHours())}:${this.twoDigits(
        date.getMinutes()
      )}:${this.twoDigits(date.getSeconds())}`
    },
    toggleShowemployeeList: function() {
      if (!this.isShowReport) {
        if (this.isShowemployeeList === false) {
          this.isShowemployeeList = true
        } else {
          this.isShowemployeeList = false
        }
      }
    },
    toggleShowReport: function() {
      if (this.isShowReport === false) {
        this.isShowReport = true
      } else {
        this.isShowReport = false
        this.selectedRange = null
        this.reportTableData = null
      }
    },
    async logout() {
      this.$store.dispatch('root/resetToken')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    closeEvi() {
      this.isShowEvi = false
      const videoRef = this.$refs.videoRef
      if (videoRef) {
        videoRef.pause()
      }
    },
    fourDigits: num => `${`000${num}`.substr(-4)}`,
    twoDigits: num => `${`0${num}`.substr(-2)}`,
    skipToPeriod(ms) {
      const videoRef = this.$refs.videoRef
      if (videoRef) {
        videoRef.currentTime = ms / 1000
      }
    },
    showEvi(sessionId) {
      this.isLoading = true
      const eviName = `session_${this.fourDigits(sessionId)}`
      if (!this.eviVideos[eviName]) {
        getGCSUrl({ gcpath: `${eviName}/video.mp4` }).then(response => {
          if (response.message !== '"File not existed"') {
            this.eviVideos = { ...this.eviVideos, ...{ [eviName]: response.message[0] }}
            getGCSUrl({ gcpath: `${eviName}/periods_info.json` }).then(response2 => {
              if (response2.message !== '"File not existed"') {
                const url = response2.message[0]
                fetch(url, {
                  method: 'get'
                })
                  .then(res => res.json())
                  .then(response3 => {
                    this.isLoading = false
                    let arrPeriod = response3
                    if (arrPeriod && arrPeriod.length > 0) {
                      arrPeriod = arrPeriod.filter((e) => e.duration > 1000)
                      arrPeriod.forEach((e, i) => {
                        e.no = i + 1
                      })
                      arrPeriod = arrPeriod.sort((a, b) => b.duration - a.duration)
                    }
                    this.eviPeriods = { ...this.eviPeriods, ...{ [eviName]: arrPeriod }}
                    this.periodEviName = eviName
                    console.log(this.eviPeriods[this.periodEviName])
                  })
              }
              this.isLoading = false
              this.videoEviName = eviName
              this.isShowEvi = true
            })
          } else {
            this.isLoading = false
            this.videoEviName = eviName
            this.isShowEvi = true
          }
        })
      } else {
        this.isLoading = false
        this.periodEviName = eviName
        this.videoEviName = eviName
        this.isShowEvi = true
      }
    },
    msToStr(ms, _callCount = 1) {
      if (ms < 1000) {
        return ms + ' ms '
      }
      if (ms < 60000) {
        const secs = Math.floor(ms / 1000)
        _callCount += 1
        return secs + ` sec${secs === 1 ? '' : 's'} `
      }
      if (ms < 3600000) {
        const mins = Math.floor(ms / 60000)
        _callCount += 1
        return (
          mins +
          ` min${mins === 1 ? '' : 's'} ` +
          this.msToStr(ms % 60000, _callCount)
        )
      }
      const hours = Math.floor(ms / 3600000)
      _callCount += 1
      return (
        hours +
        ` hour${hours === 1 ? '' : 's'} ` +
        this.msToStr(ms % 3600000, _callCount)
      )
    }
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
