<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Register Form</h3>
      </div>
      <!-- name -->
      <el-form-item prop="name">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="name"
          v-model="registerForm.employeeCode"
          placeholder="Employee Name"
          name="name"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <!-- role -->
      <el-form-item prop="role">
        <el-select class="form-control" @change="changeRoleTitle($event)">
          <el-option value="" selected disabled>Choose</el-option>
          <el-option
            v-for="roleTitle in jobTitles"
            :key="roleTitle.id"
            :value="roleTitle.id"
          >
            {{ roleTitle.name }}
          </el-option>
        </el-select>
      </el-form-item>

      <!-- button -->
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleRegister"
      >Register</el-button>
    </el-form>
  </div>
</template>
<script>
import { register } from '@/api/root'
import { setToken } from '@/utils/auth'
export default {
  name: 'Register',
  data() {
    const validateName = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('Please enter your name'))
      } else {
        callback()
      }
    }
    const validateRole = (rule, value, callback) => {
      if (value < 1) {
        callback(new Error('Please choose your role'))
      } else {
        callback()
      }
    }
    return {
    //   registerForm: {
    //     employeeCode: '',
    //     password: ''
    //   },
      registerRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName }
        ],
        role: [
          { required: true, trigger: 'blur', validator: validateRole }
        ]
      },
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.registerForm.name === '') {
      this.$refs.name.focus()
    } else if (this.registerForm.role < 1) {
      this.$refs.role.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        this.loading = true
        const data = {
          name: this.registerForm.name,
          role: this.registerForm.role
        }
        const _this = this
        register(data).then((res) => {
          setToken(res.data.token)
          _this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery
          })
          _this.loading = false
          console.log(res)
        })
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}

</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/hieuliemfe/esms-webapp/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
    .el-input[type=text] {
        text-transform: capitalize;
    }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
