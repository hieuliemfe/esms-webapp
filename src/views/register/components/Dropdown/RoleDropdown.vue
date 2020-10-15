<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-select class="roles" placeholder="Choose Role" @change="changeRoleName($event)">
      <el-option v-for="role in roles" :key="role.name" :value="role.id">{{ role.name }}</el-option>
    </el-select>
  </el-dropdown>
</template>

<script>
import { getRoles } from '@/api/roles'
import axios from 'axios'

const role = {
  id: 0,
  name: ''
}
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data: function() {
    return {
      roles: Object.assign({}, { role }),
      selectedRoleName: null
    }
  },
  computed: {
    comment_disabled: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    changeRoleName(event) {
      this.selectedRoleName = event.target.options[event.target.options.selectedIndex].text
    },
    getRoles() {
      axios
        .get(getRoles)
        .then((response) => {
          this.list = response.data
        })
    }
  }
}
</script>
