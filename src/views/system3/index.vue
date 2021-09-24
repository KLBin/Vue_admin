<template>
  <div class="app-container">
    <!-- @click="handleAddRole" -->
    <el-button type="primary" @click="addDialogVisible = true" >新增角色</el-button>
    
    <el-card>
      <!-- 用户列表区域 -->
      <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
        <el-table-column align="center" label="角色id">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色号">
          <template slot-scope="scope">
            {{ scope.row.roleNum }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="描述">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="dangere"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </el-card>

    <!--添加角色的对话框-->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!--内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="角色号" prop="roleNum">
          <el-input v-model="addForm.roleNum"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, deleteRole, addRole } from "@/api/role";

export default {
  data() {
    return {
      //获取用户列表的参数对象
      rolesList:[],
      addDialogVisible: false, // 控制添加角色对话框是否显示
      // 添加角色的表单数据
      addForm: {
        roleNum: '',
        description: ''
      },
      // 添加用户表单的验证规则对象
      addFormRules: {
        roleNum: [
          { required: true, message: '请输入角色号', trigger: 'blur' },
          { min: 0, max: 10, message: '长度在 0 到 10 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getRolesList();
  },
  methods: {
    getRolesList(){
      getRoles()
        // 请求成功
        .then((res) => {
          this.rolesList = res.data.dataList
          this.total = res.data.dataList.length
          console.log(res.data.dataList,res.data.dataList.length);
        })
        // 请求失败
        .catch((err) => {
          console.log(err)
        });
    },
    handleDelete({ $index, row }) {
      this.$confirm('是否确认删除此角色?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    // 监听 添加用户对话框的关闭事件
    addDialogClosed() {
    // 表单内容重置为空
      // console.log(1231312312)
      this.$refs.addFormRef.resetFields() // 通过ref引用调用resetFields方法
    },
    // 点击按钮 添加新角色
    confirm() {
      // console.log(this.addForm)
      // addRole(this.addForm)
      this.$refs.addFormRef.validate(async valid => {
        
        if (!valid) return
        await addRole(this.addForm)
          // 请求成功
          .then((res) => {
            console.log(this.addForm)
            this.$message.success('添加角色成功')
          })
          // 请求失败
          .catch((err) => {
            console.log(err)
          });
        // const { data: res } = await this.$http.post('roles', this.addForm)
        // if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        // this.$message.success('添加角色成功')
        // 隐藏添加角色的对话框
        this.addDialogVisible = false
        // 重新发起请求角色列表
        this.getRolesList()
      })
    }
  }
}
</script>

<style scoped>
.el-card{
    box-shadow: 0 1px 1px rgba(0,0,0,0.15)  !important;
}
.el-pagination{
  margin-top: 20px;
  text-align:center
}
</style>

