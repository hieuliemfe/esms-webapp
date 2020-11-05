<template>
  <div class="app-container">
    <div v-if="list" class="conditionTable">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Add
      </el-button>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Condition</th>
            <th scope="col">Limit Session</th>
            <th scope="col">Limit Percentage</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody v-for="(row, index) in list" :key="row">
          <tr>
            <th>{{ index }}</th>
            <td>
              Percentage of Angry {{ row.operator }} {{ row.comparingNumber * 100 }}%
            </td>
            <td>{{ row.NegativeEmotionActions.percentageLimit }}</td>
            <td>{{ row.NegativeEmotionActions.percentageLimit }}</td>
            <td>
              <el-button
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdate(row)"
              >Edit</el-button>
              <el-button
                class="filter-item"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(row,$index)"
              >Delete</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="190px" style="width: 450px; margin-left:50px;">
        <el-form-item label="Angry time per session(%)">
          <el-select v-model="temp.operator" class="filter-item" placeholder="Operator" style="width: 100px;">
            <el-option v-for="item in operatorOptions" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select v-model="temp.comparingNumber" class="filter-item" placeholder="Number" style="width: 100px;">
            <el-option v-for="item in comparingNumberOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Limit Number of Session">
          <el-input-number v-model="temp.session" type="number" :min="1" />
        </el-form-item>
        <el-form-item label="Limit of Percentage(%)">
          <el-input-number v-model="temp.percent" type="number" :min="1" :max="100" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import waves from '@/directive/waves'
import { getCriterias, addCriterias, updateCriterias } from '@/api/negative-emotion'
export default {
  name: 'SettingCondition',
  components: {},
  directives: { waves },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      operatorOptions: ['>', '>=', '<', '<='],
      comparingNumberOptions: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      list: undefined,
      temp: {
        id: undefined,
        condition: undefined,
        operator: undefined,
        session: undefined,
        percent: undefined,
        comparingNumber: undefined
      }
    }
  },
  created() {
    this.getCriterias()
  },
  methods: {
    getCriterias() {
      getCriterias().then(response => {
        this.list = response.message
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        condition: undefined,
        operator: undefined,
        session: undefined,
        percent: undefined,
        comparingNumber: undefined

      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addCriterias(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.comparingNumber = row.comparingNumber * 100
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateCriterias(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      // deteleCriterias
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
