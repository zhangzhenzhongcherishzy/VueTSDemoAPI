<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="角色ID" prop="id">
      <el-input v-model="ruleForm.id" />
    </el-form-item>
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="角色编码" prop="code">
      <el-input v-model="ruleForm.code" />
    </el-form-item>

    <el-form-item label="角色状态" prop="status">
      <el-switch
        v-model="ruleForm.status"
        inline-prompt
        active-text="启用"
        inactive-text="禁用"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :disabled="props.disabled"
        :loading="props.loading"
        @click="props.submitForm(ruleFormRef)"
      >
        Create
      </el-button>
      <el-button @click="reset">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { type RolesType, requestGetRolesPage, addRole, editRole } from '@/service/utils'
import { reactive, ref, watch } from 'vue'
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from 'element-plus'

const ruleFormRef = ref<FormInstance>()


let resetFormData: RolesType = {
  code: '',
  createTime: '',
  name: '',
  sort: 1,
  status: 1
}

const props = defineProps<{
  formData: RolesType
  disabled: boolean
  loading: boolean
  submitForm: (a: any) => void
}>()

const formSize = ref<ComponentSize>('default')

const rules = reactive<FormRules<RolesType>>({
  id: [{ required: true, message: '不可以为空', trigger: 'blur' }],
  name: [{ required: true, message: '不可以为空', trigger: 'blur' }],
  code: [{ required: true, message: '不可以为空', trigger: 'blur' }],
  status: [{ required: true, message: '不可以为空', trigger: 'blur' }]
})

const ruleForm = ref<RolesType>(props.formData)

watch(
  () => props.formData,
  (nVal) => {
    console.log(nVal, 'ruleFormruleFormruleForm')
    ruleForm.value = nVal
    resetFormData = JSON.parse(JSON.stringify(nVal))
    console.log(resetFormData, 'resetFormData')
  },
  {
    immediate: true
  }
)

// watch(ruleForm, (nVal) => {
//   console.log(nVal, 'reffffruleFormruleFormruleForm')
// })

//  手动重置表单数据（不使用 表单组件抛出的方法重置）
const resetFieldsData = () => {
  ruleForm.value = JSON.parse(JSON.stringify(resetFormData))

  console.log(resetFormData, 'resetFormDataresetFormData')

  console.log('重置表单数据')
}

const reset = () => {
  resetFieldsData()
  ruleFormRef.value?.clearValidate()
}

defineExpose({
  reset,
  resetFieldsData
})
</script>

<style></style>
