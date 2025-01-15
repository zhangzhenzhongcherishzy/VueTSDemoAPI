<template>
  <div id="wrap">
    <h1>学生信息管理系统</h1>
    <div>
      <div class="search">
        <el-card>
          <el-form :inline="true" :model="searchParams" class="demo-form-inline">
            <!-- ----------------------------------------按时间搜索------------------------------------------ -->
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="searchParams.startDate"
                type="date"
                placeholder="选择时间"
                clearable
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="searchParams.endDate"
                type="date"
                placeholder="选择时间"
                clearable
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <!-- ----------------------------------------名称输入框------------------------------------------ -->
            <el-form-item label="角色名称">
              <el-input v-model="searchParams.keywords" placeholder="输入角色名称" />
            </el-form-item>
            <!-- ----------------------------------------搜索按钮------------------------------------------ -->
            <el-form-item>
              <el-button type="primary" @click="getPageData">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <div class="mytable">
        <!-- ----------------------------------------添加按钮------------------------------------------ -->
        <el-card class="gongju">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-button type="primary" @click="addItemHandler()"> 添加 </el-button>
            </el-col>
          </el-row>
        </el-card>
        <!-- ----------------------------------------数据渲染列表------------------------------------------ -->
        <el-card>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column fixed prop="sort" label="排序" width="100" />
            <el-table-column prop="id" label="角色ID" width="120" />
            <el-table-column prop="name" label="角色名称" width="120" />
            <el-table-column prop="code" label="角色编码" width="120" />
            <el-table-column
              prop="status"
              label="角色状态"
              width="120"
              :formatter="statusFormatter"
            />
            <el-table-column fixed="right" label="操作" min-width="150">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="editItemHandler(row)">
                  修改
                </el-button>
                <el-button link type="primary" size="small" @click="delItemHadler(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="250" />
          </el-table>
        </el-card>
      </div>
      <!-- ----------------------------------------页码分页器------------------------------------------ -->
      <div class="mypage">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pageParams.total"
          @change="pageChangeHandler"
        />
      </div>

      <!-- ----------------------------------------添加按钮弹窗------------------------------------------ -->
      <el-dialog v-model="dialogFormVisible" :title="ruleFormInfo.title" width="800">
        <RoleForm
          ref="ruleFormRef"
          :form-data="ruleForm"
          :disabled="isSBtnDisable"
          :loading="isSBtnLoding"
          :submitForm="submitForm"
        ></RoleForm>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RolePage',
}
</script>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import { type RolesType, requestGetRolesPage, addRole, editRole, delRole } from '@/service/utils'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import RoleForm from './components/RoleForm.vue'
import { isObject } from 'lodash'

/*-------------------------------------------请求数据变量容器---------------------------------------- */
const tableData = ref<RolesType[]>()

/*-------------------------------------------请求角色数据参数设置---------------------------------------- */
const pageParams = ref({
  pageNum: 1, //当前页
  pageSize: 15, //每页数量
  total: 0,
})
/*-------------------------------------------搜索框关键字---------------------------------------- */
const searchParams = ref({
  keywords: '',
  startDate: '',
  endDate: '',
})

/*-------------------------------------------控制是否显示弹窗布尔值---------------------------------------- */
const dialogFormVisible = ref(false)
const isSBtnLoding = ref(false)
const isSBtnDisable = ref(false)
const ruleFormRef = useTemplateRef('ruleFormRef')
//
const ruleForm = ref<RolesType>({
  code: '',
  createTime: '',
  name: '',
  sort: 1,
  status: 1,
})

/*-------------------------------------------判断添加与修改关键字---------------------------------------- */
const ruleFormInfo = ref<{ type: 'add' | 'edit'; title: string }>({
  type: 'add',
  title: '添加数据',
})

/*-------------------------------------------提交表单:@param formEl表单组件对象---------------------------------------- */
const submitForm = async (formEl: FormInstance | undefined) => {
  isSBtnLoding.value = true
  isSBtnDisable.value = true
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res
      try {
        ruleForm.value.id = Number(ruleForm.value.id)
        // 添加操作
        if (ruleFormInfo.value.type === 'add') {
          // http请求
          res = await addRole(ruleForm.value)
        }
        //修改操作
        if (ruleFormInfo.value.type === 'edit') {
          // http请求
          res = await editRole(String(ruleForm.value.id), ruleForm.value)
        }
        if (res!.code !== '2000') {
          throw new Error(isObject(res?.msg) ? (res.msg as { Message: string })?.Message : res?.msg)
        }
        ElMessage.success(ruleFormInfo.value.type === 'add' ? `添加成功` : `修改成功`)
        getPageData()
      } catch (error: unknown) {
        if (error instanceof Error) {
          ElMessage.error(error.message)
        } else {
          ElMessage.error('未知错误')
        }
      } finally {
        isSBtnLoding.value = false
        isSBtnDisable.value = false
        // 关闭模态框
        dialogFormVisible.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

/*-------------------------------------------get请求获取分页数据---------------------------------------- */
const getPageData = async () => {
  const resRoles = await requestGetRolesPage({
    // 分页参数
    pageNum: pageParams.value.pageNum,
    pageSize: pageParams.value.pageSize,
    // 检索的参数
    ...searchParams.value,
  })
  console.log(resRoles.data)
  tableData.value = resRoles.data.list
  pageParams.value.total = resRoles.data.total
}

/*-------------------------------------------post请求添加数据---------------------------------------- */
const addItemHandler = async () => {
  //显示弹窗
  dialogFormVisible.value = true
  // 重置表单数据
  ruleForm.value = JSON.parse(
    JSON.stringify({
      code: '',
      createTime: '',
      name: '',
      sort: 1,
      status: 1,
    }),
  )
  ruleFormInfo.value = {
    type: 'add',
    title: '添加角色',
  }
  ruleFormRef.value?.reset()
}

/*-------------------------------------------put修改角色数据---------------------------------------- */
const editItemHandler = (row: RolesType) => {
  dialogFormVisible.value = true
  ruleFormInfo.value = {
    type: 'edit',
    title: '修改角色',
  }
  // 重置：填充表单
  ruleForm.value = JSON.parse(JSON.stringify(row))
  ruleFormRef.value?.reset()
}
/*-------------------------------------------delete删除角色---------------------------------------- */
const delItemHadler = (row: RolesType) => {
  ElMessageBox.confirm('确认删除?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await delRole(`${row.id}`)
        console.log()
        if (res.data.code !== '2000') {
          throw new Error(res.data.msg)
        }
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getPageData()
      } catch (error: unknown) {
        if (error instanceof Error) {
          ElMessage({
            type: 'error',
            message: error.message,
          })
        } else {
          ElMessage.error('未知错误')
        }
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
/*-------------------------------------------挂载阶段自动获取角色信息---------------------------------------- */
onMounted(() => {
  getPageData()
})
/*-------------------------------------------分页事件---------------------------------------- */
const pageChangeHandler = (currentPage: number, pageSize: number) => {
  pageParams.value.pageNum = currentPage
  pageParams.value.pageSize = pageSize
  getPageData()
}
/*-------------------------------------------转化用户状态的方法---------------------------------------- */

const statusFormatter = (row: RolesType, column: unknown, cellValue: number) => {
  if (cellValue === 1) return '正常'
  if (cellValue === 0) return '停用'
  return '未知'
}
</script>

<style lang="scss" scoped>
.mypage {
  margin: 10px 0;
}
.gongju {
  margin: 10px 0;
}
</style>
