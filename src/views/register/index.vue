<template>
  <div class="app-container">
    <el-row>
      <el-card class="box-card">
        <div style="margin-bottom:50px;">
          <el-col :span="6" class="text-center">
            <router-link class="pan-btn blue-btn" to="/">
              Download Excel Sample
            </router-link>
          </el-col>
          <el-col :span="6" class="text-center">
            <button class="pan-btn light-blue-btn" @click="isHidden = !isHidden">
              Import From <span :class="{active:isHidden}">{{ isHidden ? 'Form' : 'Excel' }}</span>
            </button>
          </el-col>
        </div>
        <div v-if="isHidden" class="editor-container">
          <dropzone id="myVueDropzone" url="https://httpbin.org/post" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
        </div>
      </el-card>
    </el-row>
    <el-row>
      <el-card v-if="!isHidden" class="box-card">
        <form-register :is-edit="false" />
      </el-card>
    </el-row>
  </div>
</template>
<script>
import Dropzone from '@/components/Dropzone'
import FormRegister from './components/FormRegister'

export default {
  name: 'Register',
  components: { Dropzone, FormRegister },
  data: function() {
    return {
      isHidden: false
    }
  },
  methods: {
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    }
  }
}
</script>
