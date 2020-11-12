<template>
  <div class="container">
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
          v-on:click="toggleShowemployeeList"
        >
          <div class="iconBox">
            <i class="far fa-calendar-alt" />
          </div>
          <span class="btnText">Employees</span>
        </div>
        <div class="btnNav" v-on:click="logout">
          <div class="iconBox">
            <i class="fa fa-sign-out-alt" />
          </div>
          <span class="btnText">Logout</span>
        </div>
        <div class="paddingFlex" />
        <div class="avatarNav">
          <div class="avatarBox">
            <img class="avatar" :src="profile.avatarUrl" alt="EmployeeAvatar" />
          </div>
          <span class="avatarText">{{ profile.fullname }}</span>
        </div>
      </div>
    </div>
    <div :class="{ employeeListWrapper: true, show: isShowemployeeList }">
      <div class="employeeListInner">
        <span class="employeeListTitle">Employees</span>
        <div class="employeeList">
          <ul>
            <li v-for="employee in employeeList" :key="employee.name">
              <div class="">
                <div class="">
                  <i class="far fa-clock" />
                  <span class="employeeName">{{ employee.name }}</span>
                </div>
                <div class="">
                  <div>
                    <label>Angry Warning: </label><span>{{ employee.angryWarningCount }}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="employeeSeparator" />
        <div class="btnEndemployee">
          <span>End your employee</span>
        </div>
      </div>
    </div>
    <div class="mainContent">
      <div class="headerWrapper">
        <div class="firstPart">
          <div class="calendarWrapper">
            <span class="calendarTitle">Nov, 2020</span>
          </div>
          <div class="greetingWrapper">
            <div class="welcomeWrapper">
              <span class="hello"> Hello, {{ profile.fullname }} </span>
              <span class="tips">Have a nice day!</span>
              <span class="tips">
                Please check in your employee to start working!
              </span>
            </div>
            <img :src="logo" alt="ESMSLogo" class="greetingLogo" />
          </div>
        </div>
      </div>
      <div class="footerWrapper">
        <span class="footerTitle">Session History</span>
      </div>
    </div>
  </div>
</template>
<script>
// import FilterContainer from "@/components/Filter";
// import ActionSuggest from "./components/ActionToImproveList";
// import WarningList from "./components/WarningList";
// import ReportEmotion from "./components/ReportEmotion";
import waves from '@/directive/waves'
export default {
  name: 'TakeCareEmployee',
  // components: { WarningList, ActionSuggest, ReportEmotion, FilterContainer },
  directives: { waves },
  data() {
    return {
      logo: '',
      isShowemployeeList: false,
      avatarUrl: '',
      show: false,
      list: null,
      listLoading: true,
      profile: {
        fullname: 'Nguyen Hieu Liem',
        avatarUrl: ''
      },
      employeeList: [
        {
          name: 'employee 1',
          angryWarningCount: 10
        },
        {
          name: 'employee 2',
          angryWarningCount: 10
        },
        {
          name: 'employee 3',
          angryWarningCount: 10
        },

      ]
    }
  },
  methods: {
    toggleShowemployeeList: function() {
      if (this.isShowemployeeList === false) {
        this.isShowemployeeList = true
      } else {
        this.isShowemployeeList = false
      }
    },
    logout: function() {

    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
@import '~@fortawesome/fontawesome-free/css/all.css';
.container {
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

.employeeListWrapper {
  display: block;
  position: relative;
  width: 0;
  height: 100%;
  transition: all 0.1s ease-in;
  overflow: hidden;
}

.employeeListWrapper.show {
  width: 25vw;
}

.employeeListInner {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 25vw;
  padding: 50px 0 0 50px;
  height: 100%;
  overflow: hidden;
}

.employeeListTitle {
  width: 100%;
  font-weight: bold;
  font-size: 28px;
}

.employeeList {
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  align-items: center;
}

.employeeItem {
  display: flex;
  width: 100%;
  padding: 12px 14px;
  margin: 8px 0;
  justify-content: space-between;
  border: 2px solid #e6f1ff;
  border-radius: 10px;
  color: #999;
}

.employeeItem.unavailable {
  background-color: #e6f1ff;
}

.employeeItem.available {
  border-color: #1479ff;
  color: #1479ff;
}

.employeeItem.active {
  border-color: #1479ff;
  background-color: #1479ff;
  color: #fff;
}

.employeeHead {
  display: flex;
  height: 100%;
  align-items: center;
}

.employeeHead i {
  font-size: 16px;
}

.employeeName {
  margin-left: 12px;
}

.employeeTail {
  display: flex;
  height: 100%;
  align-items: center;
}

.startTime::after {
  content: "-";
  display: inline-block;
  padding-left: 10px;
}

.endTime {
  padding-left: 10px;
}

.employeeSeparator {
  width: 50%;
  height: 1px;
  background-color: #999;
  margin: 10px auto;
}

.btnEndemployee {
  display: flex;
  width: 100%;
  padding: 12px 14px;
  margin: 16px 0;
  justify-content: center;
  align-items: center;
  background-color: #1479ff;
  border: 2px solid #1479ff;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
}

.btnEndemployee:hover {
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
  position: relative;
  margin-bottom: 20px;
}

.firstPart {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  width: 100%;
  height: 100%;
  transition: all 0.1s ease-in-out;
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
  transition: all 0.1s ease-in-out;
}

.footerWrapper {
  display: flex;
  flex: auto;
  width: 100%;
  padding: 30px;
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
</style>
