<template>
  <div class="esms-container">
    <div class="sideBar">
      <span class="appName">EsmsApp</span>
      <div class="navigation">
        <div class="btnNav active noHover">
          <div class="iconBox">
            <i class="fa fa-home" />
          </div>
          <span class="btnText">Home</span>
        </div>
        <div
          :class="{ btnNav: true, active: isShowemployeeList }"
          @click="toggleShowemployeeList"
        >
          <div class="iconBox">
            <i class="far fa-calendar-alt" />
          </div>
          <span class="btnText">Employees</span>
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
            <img class="avatar" :src="avatarUrl+'?imageView2/1/w/80/h/80'" alt="EmployeeAvatar">
          </div>
          <span class="avatarText">{{ profile.fullname }}</span>
        </div>
      </div>
    </div>
    <div :class="{ shiftListWrapper: true, show: isShowemployeeList }">
      <div class="shiftListInner">
        <span class="shiftListTitle">Bank teller list</span>
        <div class="shiftList">
          <div v-for="employee in employeeList" :key="employee.id" class="available shiftItem" @click="viewHistory(employee.employeeCode)">
            <div class="shiftHead">
              <!-- <i class="far fa-clock" /> -->
              <span class="shiftName">{{ employee.fullname }}</span>
            </div>
            <div class="shiftTail">
              <!-- <span class="startTime">{sh.shiftStart}</span> -->
              <span class="endTime">{{ `Warnings: ${employee.angryWarningCount}` }}</span>
                <div class="shiftBtn">
                  View history
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mainContent">
      <div class="headerWrapper">
        <div class="firstPart">
          <!-- <div class="calendarWrapper">
            <span class="calendarTitle">Nov, 2020</span>
          </div> -->
          <div class="greetingWrapper">
            <div class="welcomeWrapper">
              <span class="hello"> Hello, {{ profile.fullname }} </span>
              <span class="tips">Have a nice day!</span>
              <span class="tips">
                Please check in your employee to start working!
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
              <span class="footerTitle">Session History</span>
              <span class="resultTextItem">
                {{ `Total Sessions Count: ` }}
                <span>{{ sessionSummary.totalSessions }}</span>
              </span>
              <span class="resultTextItem">
                {{ `Total Angry Warnings Count: ` }}
                <span>{{ sessionSummary.angryWarningCount }}</span>
              </span>
            </div>
            <div :class="{ videoWrapper: true, show: isShowEvi }">
              <!-- {videoEviPath ? (
                <video controls autoPlay>
                  <source src={videoEviPath} type="video/mp4" />
                  No video found
                </video>
              ) : videoEviName ? (
                <video controls autoPlay>
                  <source src={eviUrls[videoEviName]} type="video/mp4" />
                  No video found
                </video>
              ) : (
                <></>
              )} -->
            </div>
          </div>
          <div class="sessionList">
            <div v-if="sessionList.length > 0" class="sessionInner" :style="{ width: (40 + 230 * sessionList.length) + 'px'}">
              <div v-for="session in sessionList" :key="session.id" class="sessionItem">
                <div class="sessionItemHead" @click="showEvi(session.id)">
                  <i class="far fa-clock" />
                  <div class="viewEviBtn">Show Evidence</div>
                </div>
                <div class="sessionItemTail">
                  <span class="sname">
                    {{ `session_${fourDigits(session.id)}` }}
                  </span>
                  <span />
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
</template>
<script>
// import FilterContainer from "@/components/Filter";
// import ActionSuggest from "./components/ActionToImproveList";
// import WarningList from "./components/WarningList";
// import ReportEmotion from "./components/ReportEmotion";
import { getWarningList } from '@/api/employees'
import { getHistory } from '@/api/employees'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
export default {
  name: 'TakeCareEmployee',
  // components: { WarningList, ActionSuggest, ReportEmotion, FilterContainer },
  directives: { waves },
  data() {
    return {
      logo: 'https://i.upanh.org/2020/10/26/logo1.png',
      isShowemployeeList: false,
      isShowEvi: false,
      show: false,
      list: null,
      listLoading: true,
      profile: {
        fullname: 'Nguyen Hieu Liem',
        avatarUrl: ''
      },
      employeeList: [],
      sessionSummary: {
        totalSessions: 0,
        angryWarningCount: 0
      },
      sessionList: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatarUrl',
      'device'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getWarningList({ role: 3 }).then((response) => {
        this.employeeList = response.message
      })
    },
    viewHistory(code) {
      getHistory({ employeeCode: code }).then((response) => {
        this.sessionSummary = response.message.sumary
        this.sessionList = response.message.sessions
        console.log(this.sessionList)
      })
    },
    toggleShowemployeeList: function() {
      if (this.isShowemployeeList === false) {
        this.isShowemployeeList = true
      } else {
        this.isShowemployeeList = false
      }
    },
    logout: function() {

    },
    fourDigits: (num) => `${`000${num}`.substr(-4)}`,
    showEvi: function(sessionId) {

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

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
@import '~@fortawesome/fontawesome-free/css/all.css';
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

.esms-container {
  position: absolute;
  top: 60px;
  left: 10px;
  width: calc(100vw - 74px);
  height: calc(100vh - 70px);
  background-color: #f8fbff;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  -webkit-box-shadow: 0 0 100px 50px rgba(223, 233, 243, 1);
  -moz-box-shadow: 0 0 100px 50px rgba(223, 233, 243, 1);
  box-shadow: 0 0 100px 50px rgba(223, 233, 243, 1);
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
  justify-content: start;
}

.paddingFlex {
  display: block;
  flex: auto;
}

.btnNav {
  display: flex;
  margin-top: 40px;
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

.btnNav:hover .iconBox {
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

.btnNav.noHover {
  cursor: auto;
}

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
.btnNav:hover .btnText {
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
  content: '';
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
  content: '';
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
  display: block;
  width: 25vw;
  padding: 50px 0 0 50px;
  height: 100%;
  overflow: hidden;
}

.shiftListTitle {
  width: 100%;
  font-weight: bold;
  font-size: 28px;
}

.shiftList {
  display: flex;
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
}

.shiftItem.unavailable {
  background-color: #e6f1ff;
}

.shiftItem.available {
  border-color: #1479ff;
  color: #1479ff;
}

.shiftItem.active {
  border-color: #1479ff;
  background-color: #1479ff;
  color: #fff;
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
  content: '-';
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
  overflow-x: auto;
}

.waitingInner {
  display: block;
  padding: 20px;
  flex: auto;
  height: 100%;
}

.waitingInner::after {
  display: block;
  content: '';
  clear: both;
}

.waitingItem {
  float: left;
  display: flex;
  flex-direction: column;
  width: 150px;
  height: 100%;
  margin-right: 30px;
  background-color: #fff;
  border: 2px solid #f3f8ff;
  border-radius: 15px;
  -webkit-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  -moz-box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
  box-shadow: 0 0 16px 0 rgba(20, 121, 255, 0.2);
}

.waitingItem:hover {
  border: 2px solid #1479ff;
}

.waitingItemHead {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #f3f8ff;
  overflow: hidden;
  color: #1479ff;
  font-size: 20px;
  position: relative;
}

.startSessionBtn {
  position: absolute;
  justify-content: center;
  align-items: center;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color: #1479ff;
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

.waitingItem:hover .startSessionBtn {
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
}

.wCat {
  color: #999;
  text-align: center;
}

.footerWrapper {
  display: flex;
  flex: auto;
  width: 100%;
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

span.footerTitle {
  display: block;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 30px;
}

.resultWrapper {
  display: flex;
}

.resultTextWrapper {
  height: 100%;
  flex: auto;
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
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 0;
  overflow: hidden;
  padding-bottom: 20px;
  transition: all 0.1s ease;
  position: relative;
}

.videoWrapper video {
  height: 100%;
}

.btnCloseEvi {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}

.sessionListWrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.1s ease;
}

.sessionList {
  width: 100%;
  height: 100%;
  overflow-x: auto;
}

.footerTailWrapper.showVideo {
  padding-top: 10px;
}

.footerTailWrapper.showVideo .videoWrapper {
  height: 100%;
}

.footerTailWrapper.showVideo .sessionListWrapper {
  height: 0;
}

.sessionInner {
  display: block;
  padding: 20px;
  flex: auto;
  height: 100%;
}

.sessionInner::after {
  display: block;
  content: '';
  clear: both;
}

.sessionItem {
  float: left;
  display: flex;
  flex-direction: column;
  width: 200px;
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
  width: 100%;
  height: 40px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #f3f8ff;
  overflow: hidden;
  color: #1479ff;
  font-size: 20px;
  position: relative;
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

</style>
