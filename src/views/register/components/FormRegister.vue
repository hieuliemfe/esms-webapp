<template>
  <div class="createEmployee-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createEmployee-main-container">
        <!-- avatar -->
        <el-row>
          <pan-thumb :image="image" />

          <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
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
        </el-row>
        <!-- fullname -->
        <el-row>
          <el-col :span="10">
            <el-form-item style="margin-bottom: 40px;" prop="fullname">
              <MDinput v-model="postForm.fullname" :maxlength="100" name="fullname" required type="text">
                Full Name
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- phoneNumber -->
        <el-row>
          <el-col :span="10">
            <el-form-item style="margin-bottom: 40px;" prop="phoneNumber">
              <MDinput v-model="postForm.phoneNumber" :maxlength="100" name="phoneNumber" required type="tel">
                Phone Number
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- role -->
        <el-row>
          <el-col :span="10">
            <CommentDropdown v-model="postForm.comment_disabled" />
          </el-col>
        </el-row>

        <!-- <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Summary:">
          <el-col :span="8">
            <el-input v-model="postForm.content_short" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
          </el-col>
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item> -->
      </div>

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          Draft
        </el-button>
      </sticky>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import { CommentDropdown } from './Dropdown'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const defaultForm = {
  status: 'draft',
  fullname: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  name: 'FormRegister',
  components: { MDinput, Sticky, CommentDropdown, ImageCropper, PanThumb },
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
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        fullname: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      imagecropperShow: false,
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
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
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        this.postForm.fullname += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview fullname
        this.setTagsViewFullname()

        // set page fullname
        this.setPagefullname()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewFullname() {
      const fullname = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { fullname: `${fullname}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageFullname() {
      const fullname = 'Edit Article'
      document.fullname = `${fullname} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            fullname: 'success',
            message: 'Create the employee successfully',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.fullname.length === 0) {
        this.$message({
          message: 'Please fill in the necessary title and content',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: 'Successfully saved',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
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

.createEmployee-container {
  position: relative;

  .createEmployee-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
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
</style>
