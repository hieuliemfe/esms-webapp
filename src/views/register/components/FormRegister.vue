<template>
  <div class="createEmployee-container" :title="textMap[dialogStatus]">
    <el-form ref="registerForm" :model="registerForm" :rules="rules" class="form-container">
      <div class="createEmployee-main-container">
        <!-- avatar -->
        <el-row>
          <el-col>
            <pan-thumb :image="image" />
          </el-col>
        </el-row>
        <el-row style="margin-top: 60px">
          <el-col>
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
              <MDinput v-model="registerForm.avatarUrl" :maxlength="100" name="avatarUrl" required type="url">
                avatarUrl
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- fullname -->
        <el-row>
          <el-col>
            <el-form-item class="register" prop="fullname">
              <MDinput v-model="registerForm.fullname" :maxlength="100" name="fullname" required type="text">
                Full Name
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- phoneNumber -->
        <el-row>
          <el-col>
            <el-form-item class="register" prop="phoneNumber">
              <MDinput v-model="registerForm.phoneNumber" :maxlength="100" name="phoneNumber" required type="tel">
                Phone Number
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- role -->
        <el-row>
          <el-col>
            <el-form-item class="register" prop="roleId">
              <MDinput v-model="registerForm.roleId" :maxlength="100" name="roleId" required type="text" :disabled="true" :hidden="true" />
            </el-form-item>
          </el-col>
        </el-row>

        <sticky :z-index="0">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
            Active
          </el-button>
          <el-button v-loading="loading" type="warning" @click="clearForm">
            Clear
          </el-button>
        </sticky>
      </div></el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky'
import { validURL, validTel } from '@/utils/validate'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
const defaultForm = {
  fullname: '',
  phoneNumber: '',
  avatarUrl: '',
  roleId: 3,
  roleName: 'Employee'
}

export default {
  name: 'FormRegister',
  components: { MDinput, Sticky, ImageCropper, PanThumb },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + ' is required',
          type: 'error'
        })
        callback(new Error(rule.field + ' is required'))
      } else {
        callback()
      }
    }
    const validateTel = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + ' is required',
          type: 'error'
        })
        callback(new Error(rule.field + ' is required'))
      } else {
        if (validTel(value)) {
          callback()
        } else {
          this.$message({
            message: 'Phone number is number',
            type: 'error'
          })
          callback(new Error('Phone number is number'))
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
    return {
      registerForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        fullname: [{ validator: validateRequire }],
        phoneNumber: [{ validator: validateTel }],
        avatarUrl: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      dialogStatus: '',
      textMap: {
        update: 'Update Employee',
        create: 'Create New Employee'
      },
      tempRoute: {},
      imagecropperShow: false,
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'
    }
  },
  computed: {
    contentShortLength() {
      return this.registerForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.registerForm.display_time))
      },
      set(val) {
        this.registerForm.display_time = new Date(val)
      }
    },
    formSurnameCapital: {
      get: function() {
        return this.formSurname
      },
      // setter
      set: function(newSurname) {
        if (newSurname.length < 1) { this.formSurname = ''; return }
        this.formSurname = newSurname.replace(/^./, newSurname[0].toUpperCase())
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/hieuliemfe/esms-webapp/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    submitForm() {
      console.log(this.registerForm)
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            fullname: 'success',
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
    clearForm() {
      this.registerForm.roleId = 3
      this.registerForm.avatarUrl = ''
      this.registerForm.fullname = ''
      this.registerForm.phoneNumber = ''
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-col {
    display: flex;
    justify-content: center;
    align-items: center;
}
.createEmployee-container {
  position: auto;
  margin: auto;
  text-align: center;
  .createEmployee-main-container {
    padding: 40px 45px 20px 50px;
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
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
.avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
.register{
  margin-bottom: 30px;
  width: 40%;
}
</style>
